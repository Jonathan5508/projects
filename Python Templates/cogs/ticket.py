import nextcord
from nextcord.ext import commands
import asyncio
import aiosqlite
import os

class AddUser(nextcord.ui.Modal):
    def __init__(self, channel):
        super().__init__(
            "Add User to Ticket",
            timeout=300,
        )
        self.channel = channel

        self.user = nextcord.ui.TextInput(
            label="User ID",
            min_length=2,
            max_length=30,
            required=True,
            placeholder="User ID (Must be INT)"
        )

        self.add_item(self.user)

    async def callback(self, interaction: nextcord.Interaction) -> None:
        user = interaction.guild.get_member(int(self.user.value))
        if user is None:
            return await interaction.send(f"Invalid User ID! Make sure the user is in this server.")
        elif self.channel.overwrites_for(user).read_messages is True:
            await interaction.send("User is already added.")
        else:
            overwrite = nextcord.PermissionOverwrite()
            overwrite.read_messages = True
            await self.channel.set_permissions(user, overwrite=overwrite)
            await interaction.send(f"{user.mention} has been added to this ticket.")

class RemoveUser(nextcord.ui.Modal):
    def __init__(self, channel):
        super().__init__(
            "Remove User to Ticket",
            timeout=300,
        )
        self.channel = channel

        self.user = nextcord.ui.TextInput(
            label="User ID",
            min_length=2,
            max_length=30,
            required=True,
            placeholder="User ID (Must be INT)"
        )

        self.add_item(self.user)

    async def callback(self, interaction: nextcord.Interaction) -> None:
        user = interaction.guild.get_member(int(self.user.value))
        if user is None:
            return await interaction.send(f"Invalid User ID! Make sure the user is in this server.")
        elif self.channel.overwrites_for(user).read_messages is False:
            await interaction.send("User is already removed.")
        else:
            overwrite = nextcord.PermissionOverwrite()
            overwrite.read_messages = False
            await self.channel.set_permissions(user, overwrite=overwrite)
            await interaction.send(f"{user.mention} has been removed from this ticket.")

class CreateTicket(nextcord.ui.View):
    def __init__(self, bot):
        super().__init__(timeout=None)

        self.bot = bot

    @nextcord.ui.button(label="Create Ticket", style=nextcord.ButtonStyle.blurple, custom_id="create_ticket:blurple")
    async def create_ticket(self, button: nextcord.ui.Button, interaction: nextcord.Interaction):
        msg = await interaction.response.send_message("Making ticket...", ephemeral=True)
        async with self.bot.db.cursor() as cursor:
            await cursor.execute("SELECT role FROM roles WHERE guild = ?", (interaction.guild.id,))
            role = await cursor.fetchone()
            if role:
                overwrites = {
                    interaction.guild.default_role: nextcord.PermissionOverwrite(read_messages=False),
                    interaction.guild.get_member(interaction.user.id): nextcord.PermissionOverwrite(read_messages=True),
                    interaction.guild.me: nextcord.PermissionOverwrite(read_messages=True),
                    interaction.guild.get_role(role[0]): nextcord.PermissionOverwrite(read_messages=True)
                }
            else:
                overwrites = {
                    interaction.guild.default_role: nextcord.PermissionOverwrite(read_messages=False),
                    interaction.guild.get_member(interaction.user.id): nextcord.PermissionOverwrite(read_messages=True),
                    interaction.guild.me: nextcord.PermissionOverwrite(read_messages=True)
                }
        channel = await interaction.guild.create_text_channel(f"{interaction.user.name}-ticket", overwrites=overwrites)
        await msg.edit(f"Ticket Created! {channel.mention}")
        embed = nextcord.Embed(title="Ticket Created!", description=f"{interaction.user.mention} has created a ticket. Click a button below to alter the settings.")
        await channel.send(f"{interaction.user.mention}", embed=embed, view=TicketSettings())

class TicketSettings(nextcord.ui.View):
    def __init__(self):
        super().__init__(timeout=None)

    @nextcord.ui.button(label="Add User", style=nextcord.ButtonStyle.green, custom_id="ticket_settings:green")
    async def add_user(self, button: nextcord.ui.Button, interaction: nextcord.Interaction):
        await interaction.response.send_modal(AddUser(interaction.channel))

    @nextcord.ui.button(label="Remove User", style=nextcord.ButtonStyle.gray, custom_id="ticket_settings:gray")
    async def remove_user(self, button: nextcord.ui.Button, interaction: nextcord.Interaction):
        await interaction.response.send_modal(RemoveUser(interaction.channel))

    @nextcord.ui.button(label="Close Ticket", style=nextcord.ButtonStyle.red, custom_id="ticket_settings:red")
    async def close_ticket(self, button: nextcord.ui.Button, interaction: nextcord.Interaction):
        messages = await interaction.channel.history(limit=None, oldest_first=True).flatten()
        contents = [message.content for message in messages]
        final = ""
        for msg in contents:
            msg = msg + "\n"
            final = final + msg
        with open("transcript.txt", "w") as f:
            f.write(final)
        await interaction.response.send_message("Ticket is being closed...", ephemeral=True)
        await interaction.channel.delete()
        await interaction.user.send("Ticket closed successfully!", file=nextcord.File(r'transcript.txt'))
        os.remove("transcript.txt")

class Ticket(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        setattr(self.bot, "db", await aiosqlite.connect("main.db"))
        async with self.bot.db.cursor() as cursor:
            await cursor.execute("CREATE TABLE IF NOT EXISTS roles (role INTEGER, guild INTEGER)")
        await self.bot.db.commit()
        await asyncio.sleep(3)
        print("Tickets is Loaded")

    @commands.command()
    @commands.has_permissions(manage_guild=True)
    async def setup_tickets(self, ctx: commands.Context):
        embed = nextcord.Embed(title="Create a Ticket!", description="Click the `Create Ticket` button below to create a ticket. The staff of the server will be notifed and help you shortly.")
        await ctx.send(embed=embed, view=CreateTicket(self.bot))

    @commands.command()
    @commands.has_permissions(manage_guild=True)
    async def setup_role(self, ctx: commands.Context, role: nextcord.Role):
        async with self.bot.db.cursor() as cursor:
            await cursor.execute("SELECT role FROM roles WHERE guild = ?", (ctx.guild.id,))
            role2 = await cursor.fetchone()
            if role2:
                await cursor.execute("UPDATE roles SET role = ? WHERE guild = ?", (role.id, ctx.guild.id,))
                await ctx.send(f"Tickets Auto-Assigned role updated.")
            else: 
                await cursor.execute("INSERT INTO roles VALUES (?, ?)", (role.id, ctx.guild.id,))
                await ctx.send(f"Tickets Auto-Assigned role added.")
        await self.bot.db.commit()

def setup(bot):
    bot.add_cog(Ticket(bot))
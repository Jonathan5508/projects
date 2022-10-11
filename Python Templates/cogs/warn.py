import nextcord
from nextcord.ext import commands 
import datetime
import asyncio
import aiosqlite

class Warn(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        setattr(self.bot, "db", await aiosqlite.connect("main.db"))
        async with self.bot.db.cursor() as cursor:
            await cursor.execute("CREATE TABLE IF NOT EXISTS warns (user INTEGER, reason TEXT, time INTEGER, guild INTEGER)")
        await self.bot.db.commit()
        await asyncio.sleep(3)
        print("Warn is loaded")

    async def addwarn(self, ctx, reason, user):
        async with self.bot.db.cursor() as cursor:
            await cursor.execute("INSERT INTO warns (user, reason, time, guild) VALUES (?, ?, ?, ?)", (user.id, reason, int(datetime.datetime.now().timestamp()), ctx.guild.id,))
        await self.bot.db.commit()

    @commands.command()
    @commands.has_permissions(manage_messages=True)
    async def warn(self, ctx: commands.Context, member: nextcord.Member, *, reason: str="No Reason Provided"):
        await self.addwarn(ctx, reason, member)
        await ctx.send(f"Warned {member.mention} for `{reason}`.")

    @commands.command()
    @commands.has_permissions(manage_messages=True)
    async def removewarn(self, ctx: commands.Context, member: nextcord.Member):
        async with self.bot.db.cursor() as cursor:
            await cursor.execute("SELECT reason FROM warns WHERE user = ? AND guild = ?", (member.id, ctx.guild.id,))
            data = await cursor.fetchone()
            if data:
                await cursor.execute("DELETE FROM warns WHERE user = ? AND guild = ?", (member.id, ctx.guild.id,))
                await ctx.send("Deleted users warning.")
            else:
                await ctx.send("No warnings found!")
        await self.bot.db.commit()

    @commands.command()
    @commands.has_permissions(manage_messages=True)
    async def warns(self, ctx: commands.Context, member: nextcord.Member):
        async with self.bot.db.cursor() as cursor:
            await cursor.execute("SELECT reason, time FROM warns WHERE user = ? AND guild = ?", (member.id, ctx.guild.id,))
            data = await cursor.fetchall()
            if data:
                em = nextcord.Embed(title=f"{member.name}'s Warnings")
                warnnum = 0
                for table in data:
                    warnnum += 1
                    em.add_field(name=F"Warning {warnnum}", value=f"Reason: {table[0]} | Date Issued: <t:{int(table[1])}:F>")
                await ctx.send(embed=em)
            else:
                await ctx.send("No warnings found!")

def setup(bot):
    bot.add_cog(Warn(bot))
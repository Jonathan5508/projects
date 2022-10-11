import nextcord
from nextcord.ext import commands
import asyncio

class Error(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        await asyncio.sleep(3)
        print ("Error handler is loaded")

    @commands.Cog.listener()
    async def on_command_error(self, ctx, error):
        if isinstance(error, commands.CommandOnCooldown):
            return await ctx.send(f"Slooooooooow it down! You can run this command again in {error.retry_after:.2f}'s.")
        if isinstance(error, commands.MissingPermissions):
            return await ctx.send("You are missing permissions to run this command.")

def setup(bot):
    bot.add_cog(Error(bot))
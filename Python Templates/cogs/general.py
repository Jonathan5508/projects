import nextcord
from nextcord.ext import commands
import asyncio

class General(commands.Cog):
    def __init__(self, bot):
        self.bot = bot 

    @commands.Cog.listener()
    async def on_ready(self):
        await asyncio.sleep(3)
        print("General commands have been loaded")
        
    @commands.command()
    async def ping(self, ctx):
        await ctx.send(f":ping_pong: Pong! Ping `{self.bot.latency * 1000:.2f}ms`.")

def setup(bot):
    bot.add_cog(General(bot))
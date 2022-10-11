import nextcord
from nextcord.ext import commands
import os
from dotenv import load_dotenv
import aiosqlite
from cogs.ticket import CreateTicket, TicketSettings

load_dotenv()

class Bot(commands.Bot):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.persistent_views_added = False
        
    async def on_ready(self):
        print(f"{bot.user} is online!")
        setattr(bot, "db", await aiosqlite.connect("main.db"))
        print("Connected to database")
        if not self.persistent_views_added:
            self.add_view(CreateTicket(self))
            self.add_view(TicketSettings())
            self.persistent_views_added = True 
            print("Persistent Views Added")
    
bot = Bot(command_prefix="!", intents=nextcord.Intents.all())

for files in os.listdir('./cogs'):
    if files.endswith(".py"):
        bot.load_extension(f"cogs.{files[:-3]}")

bot.remove_command("help")

bot.run(os.getenv("TOKEN"))
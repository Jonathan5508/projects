import nextcord
from nextcord.ext import commands
import aiosqlite
import asyncio
import random

class Economy(commands.Cog):
    def __init__(self, bot):
        self.bot = bot

    @commands.Cog.listener()
    async def on_ready(self):
        await asyncio.sleep(3)
        setattr(self.bot, "db", await aiosqlite.connect("main.db"))
        async with self.bot.db.cursor() as cursor:
            await cursor.execute("CREATE TABLE IF NOT EXISTS bank (wallet INTEGER, bank INTEGER, maxbank INTEGER, user INTEGER)")
        await self.bot.db.commit()
        print("Economy has been loaded.")

    async def create_balance(self, user):
        async with self.bot.db.cursor() as cursor:
            await cursor.execute("INSERT INTO bank VALUES(?, ?, ?, ?)", (0, 100, 500, user.id,))
        await self.bot.db.commit()
        return

    async def get_balance(self, user): 
        async with self.bot.db.cursor() as cursor:
            await cursor.execute("SELECT wallet, bank, maxbank FROM bank WHERE user = ?", (user.id,))
            data = await cursor.fetchone()
            if data is None:
                await self.create_balance(user)
                return 0, 100, 500
            wallet, bank, maxbank = data[0], data[1], data[2]
            return wallet, bank, maxbank

    async def update_wallet(self, user, amount: int):
        async with self.bot.db.cursor() as cursor:
            await cursor.execute("SELECT wallet FROM bank WHERE user = ?", (user.id,))
            data = await cursor.fetchone()
            if data is None:
                await self.create_balance(user)
                return 0
            await cursor.execute("UPDATE bank SET wallet = ? WHERE user = ?", (data[0] + amount, user.id,))
        await self.bot.db.commit()

    async def update_bank(self, user, amount):
        async with self.bot.db.cursor() as cursor:
            await cursor.execute("SELECT wallet, bank, maxbank FROM bank WHERE user = ?", (user.id,))
            data = await cursor.fetchone()
            if data is None:
                await self.create_balance(user)
                return 0
            capacity = int(data[2] - data[1])
            if amount > capacity:
                await self.update_wallet(user, amount)
                return 1
            await cursor.execute("UPDATE bank SET bank = ? WHERE user = ?", (data[1] + amount, user.id,))
        await self.bot.db.commit()

    @commands.command()
    async def balance(self, ctx: commands.Context, member: nextcord.Member = None):
        if not member:
            member = ctx.author
        wallet, bank, maxbank = await self.get_balance(member)
        em = nextcord.Embed(title=f"{member.name}'s Balance")
        em.add_field(name="Wallet", value=wallet)
        em.add_field(name="Bank", value=f"{bank}/{maxbank}")
        await ctx.send(embed=em)

    @commands.command()
    @commands.cooldown(1, 30, commands.BucketType.user)
    async def beg(self, ctx: commands.Context):
        chances = random.randint(1, 4)
        if chances == 1:
            return await ctx.send("You got nothing.")
        amount = random.randint(5, 300)
        res = await self.update_wallet(ctx.author, amount)
        if res == 0:
            return await ctx.send("You do not have an account, but one has been made for you. Please rerun the command again.")
        await ctx.send(f"You got `{amount}` coins!")

    @commands.command()
    @commands.cooldown(1, 5, commands.BucketType.user)
    async def withdraw(self, ctx: commands.Context, amount):
        wallet, bank, maxbank = await self.get_balance(ctx.author)
        try: 
            amount = int(amount)
        except ValueError: 
            pass
        if type(amount) == str:
            if amount.lower() == "max" or amount.lower() == "all":
                amount = int(bank)
        else:
            amount = int(amount)

        bank_res = await self.update_bank(ctx.author, -amount)
        wallet_res = await self.update_wallet(ctx.author, amount)
        if bank_res == 0 or wallet_res == 0:
            return await ctx.send("You do not have an account, but one has been made for you. Please rerun the command again.")
        wallet, bank, maxbank = await self.get_balance(ctx.author)
        em = nextcord.Embed(title=f"{amount} coins have been withdrawn.")
        em.add_field(name="New Wallet", value=wallet)
        em.add_field(name="New Bank", value=f"{bank}/{maxbank}")
        await ctx.send(embed=em)

    @commands.command()
    @commands.cooldown(1, 5, commands.BucketType.user)
    async def deposit(self, ctx: commands.Context, amount):
        wallet, bank, maxbank = await self.get_balance(ctx.author)
        try: 
            amount = int(amount)
        except ValueError: 
            pass
        if type(amount) == str:
            if amount.lower() == "max" or amount.lower() == "all":
                amount = int(wallet)
        else:
            amount = int(amount)

        bank_res = await self.update_bank(ctx.author, amount)
        wallet_res = await self.update_wallet(ctx.author, -amount)
        if bank_res == 0 or wallet_res == 0:
            return await ctx.send("You do not have an account, but one has been made for you. Please rerun the command again.")
        elif bank_res == 1:
            return await ctx.send("You do not have enough bank storage to deposit that much!")
        wallet, bank, maxbank = await self.get_balance(ctx.author)
        em = nextcord.Embed(title=f"{amount} coins have been deposited.")
        em.add_field(name="New Wallet", value=wallet)
        em.add_field(name="New Bank", value=f"{bank}/{maxbank}")
        await ctx.send(embed=em)

    @commands.command()
    @commands.cooldown(1, 10, commands.BucketType.user)
    async def give(self, ctx: commands.Context, member: nextcord.Member, amount):
        wallet, bank, maxbank = await self.get_balance(ctx.author)
        try: 
            amount = int(amount)
        except ValueError: 
            pass
        if type(amount) == str:
            if amount.lower() == "max" or amount.lower() == "all":
                amount = int(wallet)
        else:
            amount = int(amount)

        wallet_res = await self.update_wallet(ctx.author, -amount)
        wallet_res2 = await self.update_wallet(member, amount)
        if wallet_res == 0 or wallet_res2 == 0:
            return await ctx.send("You do not have an account, but one has been made for one of you. Please rerun the command again.")

        wallet2, bank2, maxbank2 = await self.get_balance(member)

        em = nextcord.Embed(title=f"Gave {amount} coins to {member.name}.")
        em.add_field(name=f"{ctx.author.name}'s Wallet", value=wallet)
        em.add_field(name=f"{member.name}'s Wallet", value=wallet2)
        await ctx.send(embed=em)

def setup(bot):
    bot.add_cog(Economy(bot))
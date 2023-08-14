using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Core.Entities.Identity;
using Microsoft.AspNetCore.Identity;

namespace Infrastructure.Identity
{
    public class AppIdentityDbContextSeed
    {
        public static async Task SeedUsersAsync(UserManager<AppUser> userManager)
        {
            if(!userManager.Users.Any())
            {
                var user = new AppUser
                {
                    DisplayName = "Rafael",
                    Email = "rafa@gmail.com",
                    UserName ="rafael.com",
                    Address = new Address 
                    {
                        FirstName = "Rafael",
                        LastName ="Angelino",
                        Street = "Rua Cadete João Teixeira",
                        City = "Campinas",
                        State = "SP",
                        ZipCode ="13032390" 
                    }
                };
                await userManager.CreateAsync(user, "Pa$$w0rd");
            }
        }
    }
}
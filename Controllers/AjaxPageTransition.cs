using System;
using lifeGoals.Cryptocurrencies.Ethereum;
using FtoWeb3.PageObjects;
using Microsoft.AspNetCore.Mvc;

namespace FtoWeb3.Controllers
{
    public class AjaxPageTransitionController:Controller
    {
        public IActionResult Privacy()
        {
            return PartialView("Pages/Privacy");
        }
        
        
        public IActionResult FileAdd(string address = default)
        {
            try
            {
                return PartialView("Pages/FileAdd",address);
            }
            catch (Exception)
            {
                return PartialView("Pages/Error404");
            }

        }
        
        public IActionResult FileViewer(string address = default)
        {
            try
            {
                return PartialView("Pages/FileViewer",address);
            }
            catch (Exception)
            {
                return PartialView("Pages/Error404");
            }

        }

        

        public IActionResult Error404()
        {
            return PartialView("Pages/Error404");
        }
   
    }
}
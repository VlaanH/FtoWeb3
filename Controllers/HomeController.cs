using System;
using System.Diagnostics;
using FtoWeb3.Models;
using FtoWeb3.PageObjects;
using Microsoft.AspNetCore.Mvc;

namespace FtoWeb3.Controllers
{
    public class HomeController : Controller
    {
        String GetMethodName()
        {
            //GetFrame(1) hierarchy number
            return new StackTrace(false).GetFrame(1).GetMethod().Name;
        }

        public IActionResult Privacy()
        {
            return View("Pages/Privacy");
        }
        public IActionResult FileViewer(string address)
        {
            return View("HomePages/UniversalAddressPage",new UniversalAddressPage{UserAddress = address,Page = GetMethodName()});
        }

        public IActionResult FileAdd(string address)
        {
            return View("HomePages/UniversalAddressPage",new UniversalAddressPage{UserAddress = address,Page = GetMethodName()});
        }

        public IActionResult Error404()
        {
            return View("Pages/Error404");
        }

        [ResponseCache(Duration = 0, Location = ResponseCacheLocation.None, NoStore = true)]
        public IActionResult Error()
        {
            return View(new ErrorViewModel {RequestId = Activity.Current?.Id ?? HttpContext.TraceIdentifier});
        }
    }
}
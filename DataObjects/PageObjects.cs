using System;
using System.Collections.Generic;
using FtoWeb3.Models;

namespace FtoWeb3.PageObjects
{
   
    public class BasicView
    {
        public string PageAddress { get; set; }
        
        public string PageVisitor { get; set; }
    }

    public enum EPageStatus
    {
        Owner,
        Authorized,
        NotAuthorized,
        NotFound,
        NoAccount
        
    }
    public class UniversalAddressPage:BasicView
    {
        public EPageStatus PageStatus { get; set; }
        public string Page { get; set; }
    }

}
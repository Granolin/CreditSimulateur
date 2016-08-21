using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Simu.Models
{

    public class Scale
    {
        public string Name { get; set; }

        public string Label { get; set; }

        public string Unity { get; set; }

        public string RangeError { get; set; }

        public string MinCode { get; set; }

        public string MaxCode { get; set; }

        public string MinValue
        {
            get { return SessionManager.GetValueInt(MinCode).ToString(); }
        }

        public string MaxValue
        {
            get { return SessionManager.GetValueInt(MaxCode).ToString(); }
        }
    }
}
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Simu
{
    public class Format
    {
        public static string ToAmount(int value)
        {
            return string.Format("{0:C0}", value);
        }
    }
}
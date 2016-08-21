using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Simu.Models
{
    public abstract class ScaleInt : Scale
    {
        protected int ValueInt { get; set; }
    }


    public class ScaleTaille : ScaleInt
    {
        [DynamicRange("MinDuree", "MaxDuree")]
        public int Taille
        {
            get { return ValueInt; }
            set { ValueInt = value; }
        }

        public ScaleTaille()
        {
            Name = "Taille";
            Label = "Taille mesurée";
            MinCode = "MinDuree";
            MaxCode = "MaxDuree";
            Unity = "Années";
            RangeError = "Erreuuuur";
        }
    }

}
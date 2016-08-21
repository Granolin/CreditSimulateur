using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace Simu.Models
{
    public class DynamicRangeAttribute : RangeAttribute
    {
        public string MinCode { get; set; }

        public string MaxCode { get; set; }

        private static Type GetType(string code)
        {
            if (code == "MinTaux") return typeof(double);

            return typeof(int);
        }

        public DynamicRangeAttribute(string minCode, string maxCode) : base(GetType(minCode),
                                                                            SessionManager.GetValueInt(minCode),
                                                                            SessionManager.GetValueInt(maxCode))
        {
            MinCode = minCode;
            MaxCode = maxCode;
        }

        protected override ValidationResult IsValid(object value, ValidationContext validationContext)
        {
            return base.IsValid(value, validationContext);
        }

        public override string FormatErrorMessage(string name)
        {
            return "La valeur doit être comprise entre " + SessionManager.GetValueInt(MinCode) + " et " + SessionManager.GetValueInt(MaxCode);
        }
    }

    public class DynamicRangeAttributeAdapter : DataAnnotationsModelValidator<RangeAttribute>
    {
        public DynamicRangeAttributeAdapter(ModelMetadata metadata, ControllerContext context, RangeAttribute attribute)
            : base(metadata, context, attribute)
        {
        }

        public static void SelfRegister()
        {
            DataAnnotationsModelValidatorProvider
                .RegisterAdapter(
                    typeof(DynamicRangeAttribute),
                    typeof(DynamicRangeAttributeAdapter));
        }

        public override IEnumerable<ModelClientValidationRule> GetClientValidationRules()
        {
            return new[] { new ModelClientValidationRangeRule(ErrorMessage, Attribute.Minimum, Attribute.Maximum) };
        }
    }
}
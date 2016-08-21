using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Routing;

namespace Simu
{
    public class RouteConfig
    {
        public static void RegisterRoutes(RouteCollection routes)
        {
            routes.IgnoreRoute("{resource}.axd/{*pathInfo}");

            routes.MapRoute(name: "Immobilier",
                            url: "Immobilier/",
                            defaults: new
                            {
                                controller = "Simu",
                                action = "Immo"
                            });


            routes.MapRoute(name: "Consommation",
                            url: "Consommation/",
                            defaults: new
                            {
                                controller = "Simu",
                                action = "Conso"
                            });


            routes.MapRoute(name: "Contact",
                            url: "Contact/",
                            defaults: new
                            {
                                controller = "Simu",
                                action = "Contact"
                            });

            // Default Route:
            routes.MapRoute(
               "Default", // Route name
               "{controller}/{action}/{id}", // URL with parameters
               new { controller = "Simu", action = "Immo", id = String.Empty } // Parameter defaults
            );
        }
    }
}

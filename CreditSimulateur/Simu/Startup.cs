using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(Simu.Startup))]
namespace Simu
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}

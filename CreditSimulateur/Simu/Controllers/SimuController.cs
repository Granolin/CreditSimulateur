using Simu.Models;
using System;
using System.Net.Mail;
using System.Web.Mvc;

namespace Simu.Controllers
{
    [AllowAnonymous]
    public class SimuController : Controller
    {
        // GET: Simu
        //public ActionResult Index()
        //{
        //    var infos = new SimuInfos(TypeSimu.Immo);
        //    return View(infos);
        //}

        public ActionResult Contact()
        {
            return View();
        }

        [HttpPost]
        public ActionResult Contact(FormCollection coll)
        {
            try
            {
                //create the message
                var msg = new MailMessage();
                msg.From = new MailAddress("damien.ily@laposte.net");
                msg.To.Add("damien.ily@laposte.net");
                msg.Subject = "Simulateur crédit test envoi";
                msg.IsBodyHtml = true;
                msg.Body = "Bonjour, ceci est un test d'envoi de message";

                // configure the smtp server
                var smtp = new SmtpClient("smtp.laposte.net");
                smtp.Port = 465;
                smtp.EnableSsl = true;
                smtp.Credentials = new System.Net.NetworkCredential("damien.ily", "Tomate56");

                // send the message
                smtp.Send(msg);
            }
            catch (Exception ex)
            {

            }

            return View();
        }


        public ActionResult Conso()
        {
            SessionManager.InitSessionConso();
            ViewBag.TypeCredit = "Conso";

            var infos = new SimuInfos(TypeSimu.Conso);
            return View("Credit", infos);
        }

        public ActionResult Immo()
        {
            SessionManager.InitSessionImmo();

            ViewBag.TypeCredit = "Immo";

            var infos = new SimuInfos(TypeSimu.Immo);
            return View("Credit", infos);
        }


        //public ActionResult Test()
        //{
        //    var infos = new SimuInfos();
        //    return View(infos);
        //}

        public ActionResult Param()
        {
            var infos = new SimuParam()
            {
                MinMensualite = SessionManager.MinMensualite,
                MaxMensualite = SessionManager.MaxMensualite,
                MinDuree = SessionManager.MinDuree,
                MaxDuree = SessionManager.MaxDuree,
                MinTaux = SessionManager.MinTaux,
                MaxTaux = SessionManager.MaxTaux,
                MinApport = SessionManager.MinApport,
                MaxApport = SessionManager.MaxApport
            };
            return View(infos);
        }

        [HttpPost]
        public ActionResult Param(SimuParam simuParam)
        {
            if (simuParam.MinMensualite >= simuParam.MaxMensualite)
                return RedirectToAction("Index");

            if (simuParam.MinDuree >= simuParam.MaxDuree)
                return RedirectToAction("Index");

            if (simuParam.MinTaux >= simuParam.MaxTaux)
                return RedirectToAction("Index");

            if (simuParam.MinApport >= simuParam.MaxApport)
                return RedirectToAction("Index");

            SessionManager.MinMensualite = simuParam.MinMensualite;
            SessionManager.MaxMensualite = simuParam.MaxMensualite;
            SessionManager.MinDuree = simuParam.MinDuree;
            SessionManager.MaxDuree = simuParam.MaxDuree;
            SessionManager.MinTaux = simuParam.MinTaux;
            SessionManager.MaxTaux = simuParam.MaxTaux;
            SessionManager.MinApport = simuParam.MinApport;
            SessionManager.MaxApport = simuParam.MaxApport;
            SessionManager.InitEmprunt();

            return RedirectToAction("Immo"); //TODO : Conso
        }
    }
}
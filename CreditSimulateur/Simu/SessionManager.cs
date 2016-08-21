using System;
using System.Web;

namespace Simu
{

    public class SessionManager
    {

        private static System.Web.SessionState.HttpSessionState MySession { get { return HttpContext.Current.Session; } }

        #region Durée

        public static int MinDuree
        {
            get { return (int)MySession["MinDureeKey"]; }
            set { MySession["MinDureeKey"] = value; }
        }

        public static int MaxDuree
        {
            get { return (int)MySession["MaxDureeKey"]; }
            set { MySession["MaxDureeKey"] = value; }
        }

        #endregion

        #region Taux

        public static float MinTaux
        {
            get { return (float)MySession["MinTauxKey"]; }
            set { MySession["MinTauxKey"] = value; }
        }


        internal static void InitSessionConso()
        {
            SessionManager.MinDuree = 1;
            SessionManager.MaxDuree = 10;

            SessionManager.MinTaux = 2;
            SessionManager.MaxTaux = 20;

            SessionManager.MinMensualite = 10;
            SessionManager.MaxMensualite = 1000;

            InitEmprunt();
        }

        internal static void InitSessionImmo()
        {
            SessionManager.MinApport = 0;
            SessionManager.MaxApport = 300000;

            SessionManager.MinDuree = 2;
            SessionManager.MaxDuree = 30;

            SessionManager.MinTaux = 1;
            SessionManager.MaxTaux = 4;

            SessionManager.MinMensualite = 500;
            SessionManager.MaxMensualite = 3000;

            InitEmprunt();
        }

        internal static void InitEmprunt()
        {
            SessionManager.MinEmprunt = Calc.GetMinEmprunt();
            SessionManager.MaxEmprunt = Calc.GetMaxEmprunt();
        }

        public static float MaxTaux
        {
            get { return (float)MySession["MaxTauxKey"]; }
            set { MySession["MaxTauxKey"] = value; }
        }

        #endregion

        #region Mensualite

        public static int MinMensualite
        {
            get { return (int)MySession["MinMensualiteKey"]; }
            set { MySession["MinMensualiteKey"] = value; }
        }

        public static int MaxMensualite
        {
            get { return (int)MySession["MaxMensualiteKey"]; }
            set { MySession["MaxMensualiteKey"] = value; }
        }

      

        #endregion

        #region Emprunt

        public static int MinEmprunt
        {
            get { return (int)MySession["MinEmpruntKey"]; }
            set { MySession["MinEmpruntKey"] = value; }
        }

        public static int MaxEmprunt
        {
            get { return (int)MySession["MaxEmpruntKey"]; }
            set { MySession["MaxEmpruntKey"] = value; }
        }

        #endregion

        #region Apport

        public static int MinApport
        {
            get { return (int)MySession["MinApportKey"]; }
            set { MySession["MinApportKey"] = value; }
        }

        public static int MaxApport
        {
            get { return (int)MySession["MaxApportKey"]; }
            set { MySession["MaxApportKey"] = value; }
        }

        #endregion

        #region Total

        public static int MinTotal
        {
            get { return SessionManager.MinApport + SessionManager.MinEmprunt; }
        }

        public static int MaxTotal
        {
            get { return SessionManager.MaxApport + SessionManager.MaxEmprunt; }
        }

        #endregion

        #region MontantBien

        public static int MinMontantBien
        {
            get { return Calc.GetMontantBienFromTotal(MinTotal); }
        }

        public static int MaxMontantBien
        {
            get { return Calc.GetMontantBienFromTotal(MaxTotal); }
        }

        #endregion

        public static string GetValueInt(string code)
        {
            if (code == "MinMensualite") return SessionManager.MinMensualite.ToString();
            if (code == "MaxMensualite") return SessionManager.MaxMensualite.ToString();
            if (code == "MinDuree") return SessionManager.MinDuree.ToString();
            if (code == "MaxDuree") return SessionManager.MaxDuree.ToString();
            if (code == "MinTaux") return SessionManager.MinTaux.ToString();
            if (code == "MaxTaux") return SessionManager.MaxTaux.ToString();
            if (code == "MinEmprunt") return SessionManager.MinEmprunt.ToString();
            if (code == "MaxEmprunt") return SessionManager.MaxEmprunt.ToString();
            if (code == "MinApport") return SessionManager.MinApport.ToString();
            if (code == "MaxApport") return SessionManager.MaxApport.ToString();
            if (code == "MinTotal") return SessionManager.MinTotal.ToString();
            if (code == "MaxTotal") return SessionManager.MaxTotal.ToString();
            if (code == "MinMontantBien") return SessionManager.MinMontantBien.ToString();
            if (code == "MaxMontantBien") return SessionManager.MaxMontantBien.ToString();

            throw new System.Exception("Unknown code " + code);
        }
    }
}
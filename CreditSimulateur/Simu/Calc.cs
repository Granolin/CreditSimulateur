using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace Simu
{
    public static class Calc
    {

        public static int GetEmprunt(int duree, int mensualite, float taux)
        {
            //On prend la plus grande durée possible pour maximiser l'emprunt.
            int dureeMois = duree * 12;

            //Borne supérieure : on considère que le taux est à 0%
            var right = mensualite * dureeMois;

            //Borne inférieure : 0 ?
            var left = right / 3;
            while (right - left > 1)
            {
                int EmpruntATester = (right + left) / 2;
                decimal capitalRembourseTotal = GetCapitalRembourse(mensualite, dureeMois, taux, EmpruntATester);
                if (capitalRembourseTotal > EmpruntATester)
                    left = EmpruntATester;
                else
                    right = EmpruntATester;
            }

            return right;
        }

        internal static int GetMaxEmprunt()
        {
            return GetEmprunt(SessionManager.MaxDuree, SessionManager.MaxMensualite, SessionManager.MinTaux);
        }

        internal static int GetMinEmprunt()
        {
            return GetEmprunt(SessionManager.MinDuree, SessionManager.MinMensualite, SessionManager.MaxTaux);
        }


        public static decimal GetCapitalRembourse(int mensualite, int dureeMois, float taux, int Emprunt)
        {
            decimal capitalRestant = Emprunt;
            decimal capitalRembourseTotal = 0;
            decimal interetsTotal = 0;
            for (var i = 0; i < dureeMois; i++)
            {
                decimal interets = Math.Round((capitalRestant * (decimal)taux / 12) / 100, 2);
                decimal capital = mensualite - interets;
                capitalRembourseTotal += capital;
                capitalRestant -= capital;
                interetsTotal += interets;
            }

            return Math.Round(capitalRembourseTotal, 2);
        }

        internal static int GetMontantBienFromTotal(int total)
        {
            var res = (int)Math.Round((total - 1493.5) / 1.0688);
            return res;
        }
    }
}
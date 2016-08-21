using System;
using System.Collections.Generic;
using System.Reflection;
using System.Reflection.Emit;

namespace Simu.Models
{
    public class SimuInfos
    {
        #region CONSTANTES

        public const int DUREE_IMMO = 25;

        public const int DUREE_CONSO = 10;

        public const float TAUX_IMMO = 3;

        #endregion

        [DynamicRange("MinMensualite", "MaxMensualite")]
        public int Mensualite { get; set; }

        [DynamicRange("MinDuree", "MaxDuree")]
        public int Duree { get; set; }

        [DynamicRange("MinTaux", "MaxTaux")]
        public float Taux { get; set; }

        [DynamicRange("MinEmprunt", "MaxEmprunt")]
        public int Emprunt { get; set; }

        [DynamicRange("MinApport", "MaxApport")]
        public int Apport { get; set; }

        [DynamicRange("MinTotal", "MaxTotal")]
        public int Total { get; set; }

        [DynamicRange("MinMontantBien", "MaxMontantBien")]
        public int MontantBien { get; set; }



        public int FraisNotaire { get; set; }

        public string FraisNotaireFormat
        {
            get
            {
                return string.Format("{0:### ###}", FraisNotaire);
            }
        }

        public SimuInfos(TypeSimu typeSimu)
        {
            Mensualite = SessionManager.MinMensualite;
            Duree = (typeSimu == TypeSimu.Conso) ? DUREE_CONSO : DUREE_IMMO;// SessionManager.MinDuree;
            Taux = TAUX_IMMO;//SessionManager.MaxTaux;
            Emprunt = Calc.GetEmprunt(Duree, Mensualite, Taux);
            Apport = SessionManager.MinApport;
            Total = Emprunt + Apport;
            MontantBien = Convert.ToInt32((Total - 1493.5) / 1.0688);
            FraisNotaire = Total - MontantBien;
        }
    }
}
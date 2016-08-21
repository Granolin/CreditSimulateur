using System.ComponentModel.DataAnnotations;

namespace Simu.Models
{
    public class SimuParam
    {
        [Required]
        public int MinMensualite { get; set; }

        [Required]
        public int MaxMensualite { get; set; }

        [Required]
        public int MinDuree { get; set; }

        [Required]
        public int MaxDuree { get; set; }

        [Required]
        public float MinTaux { get; set; }

        [Required]
        public float MaxTaux { get; set; }

        [Required]
        public int MinApport { get; set; }

        [Required]
        public int MaxApport { get; set; }
    }
}
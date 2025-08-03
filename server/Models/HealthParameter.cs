using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace server.Models
{
    public class HealthParameter
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid ReportId { get; set; }

        [ForeignKey("ReportId")]
        public HealthReport Report { get; set; }

        [Required]
        public string Name { get; set; }

        [Required]
        public string Value { get; set; }

        public string Unit { get; set; }
    }
}

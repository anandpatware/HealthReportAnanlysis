using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;

namespace server.Models
{
    public class HealthReport
    {
        [Key]
        public Guid Id { get; set; }

        [Required]
        public Guid UserId { get; set; } // Optional for now, can skip auth initially

        [Required]
        public string FileName { get; set; }

        [Required]
        public DateTime UploadedAt { get; set; }

        public string AiSummary { get; set; }

        // Navigation property
        public List<HealthParameter> Parameters { get; set; } = new List<HealthParameter>();
    }
}

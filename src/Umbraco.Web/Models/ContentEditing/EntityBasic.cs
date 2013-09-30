﻿using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Runtime.Serialization;
using System.Text;
using System.Threading.Tasks;
using Umbraco.Core.Models.Validation;

namespace Umbraco.Web.Models.ContentEditing
{
    [DataContract(Name = "entity", Namespace = "")]
    public class EntityBasic
    {
        [DataMember(Name = "name", IsRequired = true)]
        [RequiredForPersistence(AllowEmptyStrings = false, ErrorMessage = "Required")]
        public string Name { get; set; }

        [DataMember(Name = "id", IsRequired = true)]
        [Required]
        public object Id { get; set; }
        
        [DataMember(Name = "icon")]
        public string Icon { get; set; }

        [DataMember(Name = "parentId", IsRequired = true)]
        [Required]
        public int ParentId { get; set; }

        /// <summary>
        /// This will only be populated for some entities like macros
        /// </summary>
        [DataMember(Name = "alias")]
        public string Alias { get; set; }

        /// <summary>
        /// For now we'll exclude this from the json results, this is needed for permissions check filtering
        /// </summary>
        [IgnoreDataMember]
        public string Path { get; set; }
    }
}

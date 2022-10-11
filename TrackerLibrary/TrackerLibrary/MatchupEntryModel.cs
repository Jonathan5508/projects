using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace TrackerLibrary
{
    public class MatchupEntryModel
    {
        /// <summary>
        /// Represents 1 team in a matchup
        /// </summary>
        public TeamModel TeamCompeting { get; set; }
        /// <summary>
        /// Represents the score for that particular team
        /// </summary>
        public double Score { get; set; }
        /// <summary>
        /// Represents the matchup where the team came from
        /// </summary>
        public MatchupModel ParentMatchup { get; set; }
    }
}

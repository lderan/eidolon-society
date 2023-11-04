/**
 * Extend the basic ActorSheet with some very simple modifications
 *
 */
export class TESActorSheet extends ActorSheet {

	/** @overrride */
	getData() {
		let data = super.getData();
		return data;
	}

	async rollSkill(event) {
		const targetSuit = event.currentTarget.dataset.type;

		new Dialog({
			title:'Difficulty',
			content:`
			  <form>
				<div class="form-group">
				  <input type='text' name='inputField' value="3" />
				</div>
			  </form>`,
			buttons:{
			  yes: {
				icon: "<i class='fas fa-check'></i>",
				label: `Roll ` + targetSuit
			  }},
			default:'yes',
			close: html => {
				let result = html.find('input[name=\'inputField\']');
				if (result.val()!== '') {
					let cards = [];

					const mind = this.actor.system['mind'];
					const body = this.actor.system['body'];
					const spirit = this.actor.system['spirit'];
					const resources = this.actor.system['resources'];

					for (let i = 1; i <= mind; i++) {
						cards.push({'type':'Mind', value: i});
					}
					for (let i = 1; i <= body; i++) {
						cards.push({'type':'Body', value: i});
					}
					for (let i = 1; i <= spirit; i++) {
						cards.push({'type':'Spirit', value: i});
					}
					for (let i = 1; i <= resources; i++) {
						cards.push({'type':'Resources', value: i});
					}

					for (let i = cards.length - 1; i > 0; i--) {
						const j = Math.floor(Math.random() * (i + 1));
						[cards[i], cards[j]] = [cards[j], cards[i]];
					}

					const difficulty = parseInt(result.val());
					const drawnCards = cards.splice(0, difficulty);
					let found = false;
					let lowest = null;
					let highest = null;

					let message = "<strong>Skill: " + targetSuit + "</strong>";
					let cardsFound = "<ul>";;

					for(let i = 0; i < drawnCards.length; i++) {
						if (lowest == null || lowest.value >= drawnCards[i].value) {
							lowest = drawnCards[i]
						}
						if (highest == null || highest.value <= drawnCards[i].value) {
							highest = drawnCards[i]
						}
						cardsFound += "<li>";

						if (drawnCards[i].type == targetSuit){
							cardsFound += "<strong>";
						}
						cardsFound += drawnCards[i].value + " of ";
						switch(drawnCards[i].type){
							case 'Body': cardsFound += "Swords"; break;
							case 'Mind': cardsFound += "Wands"; break;
							case 'Spirit': cardsFound += "Cups"; break;
							case 'Resources': cardsFound += "Pentacles"; break;
						}
						if (drawnCards[i].type == targetSuit){
							cardsFound += "</strong>";
						}
						cardsFound += "</li>";

						if (drawnCards[i].type == targetSuit) {
							found = true;
						}
					}
					cardsFound += "</ul>";

					message += '<p><strong>';
					message += (found) ? 'Success':'Failure';
					message += '</strong></p>';
					message += '<strong>Cards pulled</strong>';
					message += cardsFound;
					message += "<p>Refresh increases: ";
					message += found ? lowest.value: highest.value;
					message += '</p>';

					//const tn = event.currentTarget.dataset.tn;
					ChatMessage.create({
						content: message,
						sound: CONFIG.sounds.dice,
						speaker: ChatMessage.getSpeaker({ actor: this.actor }),
					});
				}
			}
		}).render(true);
	}

	/**
	 * Activate event listeners using the prepared sheet HTML
	 * @param html {HTML}   The prepared HTML object ready to be rendered into the DOM
	 */
	activateListeners(html) {
		// Owner Only Listeners
		if (this.actor.owner) {
			console.log("woo");
		} else {
			html.find(".rollable").each((i, el) => el.classList.remove("rollable"));
		}

		// rolls
		html.find('.click-roll').click(async event => {
		  	this.rollSkill(event);
		});

		// Handle default listeners last so system listeners are triggered first
		super.activateListeners(html);
	}

}
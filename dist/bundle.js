(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const ActorSheetPC_1 = require("./sheets/ActorSheetPC");
/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */
/**
 * Init hook.
 */
Hooks.once("init", function () {
    return __awaiter(this, void 0, void 0, function* () {
        console.log(`Loading The Eidolon Society System`);
        // Register sheet application classes
        Actors.unregisterSheet("core", ActorSheet);
        Actors.registerSheet("the-eidolon-society", ActorSheetPC_1.ActorSheetPC, { types: ["character"], makeDefault: true });
    });
});
},{"./sheets/ActorSheetPC":2}],2:[function(require,module,exports){
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ActorSheetPC = void 0;
const TESActorSheet_1 = require("./TESActorSheet");
/**
 * Extend the basic ActorSheet with some very simple modifications
 *
 */
class ActorSheetPC extends TESActorSheet_1.TESActorSheet {
    /**
     * Extend and override the default options used by the 5e Actor Sheet
     * @returns {Object}
     */
    static get defaultOptions() {
        return mergeObject(super.defaultOptions, {
            classes: ["character", "sheet", "actor"],
            template: "systems/the-eidolon-society/dist/templates/actor/character.html",
            width: 830,
            height: 900,
            closeOnSubmit: false,
            submitOnChange: true,
            submitOnClose: true,
            top: 0,
            left: 0,
            editable: true,
            baseApplication: 'the-eidolon-society',
            id: "idlarp",
            popOut: true,
            minimizable: true,
            resizable: true,
            title: "null",
            scrollY: [],
            tabs: [],
            dragDrop: [],
            filters: [],
            viewPermission: 2
        });
    }
}
exports.ActorSheetPC = ActorSheetPC;
},{"./TESActorSheet":3}],3:[function(require,module,exports){
"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.TESActorSheet = void 0;
/**
 * Extend the basic ActorSheet with some very simple modifications
 *
 */
class TESActorSheet extends ActorSheet {
    /** @overrride */
    getData() {
        let data = super.getData();
        return data;
    }
    rollSkill(event) {
        return __awaiter(this, void 0, void 0, function* () {
            const targetSuit = event.currentTarget.dataset.type;
            new Dialog({
                title: 'Difficulty',
                content: `
			  <form>
				<div class="form-group">
				  <input type='text' name='inputField' value="3" />
				</div>
			  </form>`,
                buttons: {
                    yes: {
                        icon: "<i class='fas fa-check'></i>",
                        label: `Roll ` + targetSuit
                    }
                },
                default: 'yes',
                close: html => {
                    let result = html.find('input[name=\'inputField\']');
                    if (result.val() !== '') {
                        let cards = [];
                        const mind = this.actor.system['mind'];
                        const body = this.actor.system['body'];
                        const spirit = this.actor.system['spirit'];
                        const resources = this.actor.system['resources'];
                        for (let i = 1; i <= mind; i++) {
                            cards.push({ 'type': 'Mind', value: i });
                        }
                        for (let i = 1; i <= body; i++) {
                            cards.push({ 'type': 'Body', value: i });
                        }
                        for (let i = 1; i <= spirit; i++) {
                            cards.push({ 'type': 'Spirit', value: i });
                        }
                        for (let i = 1; i <= resources; i++) {
                            cards.push({ 'type': 'Resources', value: i });
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
                        let cardsFound = "<ul>";
                        ;
                        for (let i = 0; i < drawnCards.length; i++) {
                            if (lowest == null || lowest.value >= drawnCards[i].value) {
                                lowest = drawnCards[i];
                            }
                            if (highest == null || highest.value <= drawnCards[i].value) {
                                highest = drawnCards[i];
                            }
                            cardsFound += "<li>";
                            if (drawnCards[i].type == targetSuit) {
                                cardsFound += "<strong>";
                            }
                            cardsFound += drawnCards[i].value + " of ";
                            switch (drawnCards[i].type) {
                                case 'Body':
                                    cardsFound += "Swords";
                                    break;
                                case 'Mind':
                                    cardsFound += "Wands";
                                    break;
                                case 'Spirit':
                                    cardsFound += "Cups";
                                    break;
                                case 'Resources':
                                    cardsFound += "Pentacles";
                                    break;
                            }
                            if (drawnCards[i].type == targetSuit) {
                                cardsFound += "</strong>";
                            }
                            cardsFound += "</li>";
                            if (drawnCards[i].type == targetSuit) {
                                found = true;
                            }
                        }
                        cardsFound += "</ul>";
                        message += '<p><strong>';
                        message += (found) ? 'Success' : 'Failure';
                        message += '</strong></p>';
                        message += '<strong>Cards pulled</strong>';
                        message += cardsFound;
                        message += "<p>Refresh increases: ";
                        message += found ? lowest.value : highest.value;
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
        });
    }
    /**
     * Activate event listeners using the prepared sheet HTML
     * @param html {HTML}   The prepared HTML object ready to be rendered into the DOM
     */
    activateListeners(html) {
        // Owner Only Listeners
        if (this.actor.owner) {
            console.log("woo");
        }
        else {
            html.find(".rollable").each((i, el) => el.classList.remove("rollable"));
        }
        // rolls
        html.find('.click-roll').click((event) => __awaiter(this, void 0, void 0, function* () {
            this.rollSkill(event);
        }));
        // Handle default listeners last so system listeners are triggered first
        super.activateListeners(html);
    }
}
exports.TESActorSheet = TESActorSheet;
},{}]},{},[1])

//# sourceMappingURL=bundle.js.map

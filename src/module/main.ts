
import { ActorSheetPC } from "./sheets/ActorSheetPC";


/* -------------------------------------------- */
/*  Foundry VTT Initialization                  */
/* -------------------------------------------- */

/**
 * Init hook.
 */
 Hooks.once("init", async function () {
    console.log(`Loading The Eidolon Society System`);
    // Register sheet application classes
    Actors.unregisterSheet("core", ActorSheet);
    Actors.registerSheet("the-eidolon-society", ActorSheetPC, { types: ["character"], makeDefault: true });
 });
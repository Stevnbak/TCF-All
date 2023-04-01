import {DeadDropInfo, specialDescriptions, locationNames} from "./mapConstants";
import {getMapData, getItemData} from "./data";
import {roundToThree} from "@/apps/calc/utils";
const mapData = await getMapData();
const itemData = await getItemData();

export function createLootPopup(type: string) {
	let itemData = mapData["descriptions"];

	let data;
	if (mapData["lootPools"][type]) {
		data = mapData["lootPools"][type]["items"];
	} else {
		const section = document.createElement("section");
		const par = document.createElement("p");
		const parText = document.createTextNode("Uh oh! This location is missing its loot. Please let us know through Discord.");

		par.appendChild(parText);
		section.appendChild(par);
		return section;
	}
	// creates a <section> element, <table> element and a <tbody> element
	const section = document.createElement("section");

	// create the header
	const header = document.createElement("h2");
	let text = "";
	if (mapData["lootPools"][type]["tier"]) {
		text = "Tier " + mapData["lootPools"][type]["tier"] + " Spawn";
	} else {
		text = "Special Spawn";
	}
	const headerText = document.createTextNode(text);

	header.appendChild(headerText);

	// creating the table
	const table = document.createElement("table");
	// creating the table header
	const tableHeader = document.createElement("thead");

	// row
	let row = document.createElement("tr");
	// content
	let tableheaderRowContent = document.createElement("th");
	let tableheaderText = document.createTextNode("Item");
	tableheaderRowContent.appendChild(tableheaderText);
	row.appendChild(tableheaderRowContent);

	tableheaderRowContent = document.createElement("th");
	tableheaderText = document.createTextNode("Spawn %");
	tableheaderRowContent.appendChild(tableheaderText);
	row.appendChild(tableheaderRowContent);

	// tableheaderRowContent = document.createElement('th');
	// tableheaderText = document.createTextNode('Max Qty')
	// tableheaderRowContent.appendChild(tableheaderText)
	// row.appendChild(tableheaderRowContent)

	tableHeader.appendChild(row);

	// creating all cells
	const tableBody = document.createElement("tbody");
	for (let item in data) {
		let cellData = [
			item,
			data[item].chance
			// data[item].amount
		];

		// creates a table row
		const row = document.createElement("tr");

		for (let x in cellData) {
			// Create a <td> element and a text node, make the text
			// node the contents of the <td>, and put the <td> at
			// the end of the table row
			const cell = document.createElement("td");
			let text;
			if (parseInt(x) === 0) {
				text = itemData[cellData[x]]["name"] ?? "Something went wrong";
			} else if (parseInt(x) === 1) {
				let percent: number | string = roundToThree(cellData[x]);
				if (percent === 0) {
					percent = "<0.001";
				}
				text = percent + "%";
			} else if (parseInt(x) === 2) {
				text = cellData[x] + "×";
			}
			const cellText = document.createTextNode(text);
			if (parseInt(x) === 0) {
				cell.classList.add(itemData[cellData[x]]["rarity"].toLowerCase());
			}

			if (parseInt(x) === 0) {
				const img = document.createElement("img");
				if (cellData[x].includes("KeyCard")) {
					if (cellData[x].includes("Map01")) {
						img.src = `map-images/item-images/Bright_Sands_Key_Card.png`;
					} else if (cellData[x].includes("Map02")) {
						img.src = `map-images/item-images/Crescent_Falls_Key_Card.png`;
					} else if (cellData[x].includes("Map03")) {
						img.src = `map-images/item-images/Tharis_Island_Key_Card.png`;
					} else {
						img.src = `map-images/item-images/Bright_Sands_Key_Card.png`;
					}
				} else if (cellData[x].includes("Flechette Gun")) {
					img.src = `map-images/item-images/ASP_Flechette_Gun.png`;
				} else {
					img.src = `map-images/item-images/${itemData[cellData[x]]["name"].replace(" - Mk.II", "").replace(" - Prototype", "").replaceAll(" ", "_")}.png`;
				}
				img.classList.add("item-image");
				cell.appendChild(img);
			}
			cell.appendChild(cellText);
			row.appendChild(cell);
		}

		tableBody.appendChild(row);
	}

	// put the <tbody> in the <table>
	table.appendChild(tableHeader);
	table.appendChild(tableBody);

	section.appendChild(header);
	section.appendChild(table);
	return section;
}

export function createSpecialPopup(type: string, rawName: string, location: any) {
	// create our popup section
	const section = document.createElement("section");

	// create the header of the popup
	const header = document.createElement("h2");
	const headerText = document.createTextNode(locationNames[type].toString());
	header.appendChild(headerText);
	section.appendChild(header);

	// The following do not have any additional information upon popup,
	// just the same text everywhere
	if (specialDescriptions[type]) {
		// create our paragraph
		const par = document.createElement("p");
		const parText = document.createTextNode(specialDescriptions[type].toString());
		par.appendChild(parText);

		// and add it to our output
		section.appendChild(par);
	} else {
		// key doors, dead drops
		if (type == "keyDoor") {
			const keyData = itemData[rawName];
			if (keyData) {
				const sec = createKeyCardPopup(keyData);

				section.appendChild(sec);
			} else if (mapData["descriptions"][rawName] != null) {
				const sec = createKeyCardPopup(mapData["descriptions"][rawName]);
				section.appendChild(sec);
			} else {
				section.append("Something went wrong...");
			}
		}
		if (type == "DeadDrop") {
			var DeadDropData = DeadDropInfo[rawName];
			if (DeadDropData == null) DeadDropData = {ingame: rawName};
			if (DeadDropData) {
				const sec = createDeadDropPopup(DeadDropData);
				section.appendChild(sec);
			} else {
				section.append("Something went wrong...");
			}
		}
	}

	return section;
}

function createKeyCardPopup(data: any): HTMLElement {
	const div = document.createElement("div");

	const header = document.createElement("h3");
	const headerText = document.createTextNode(data["inGameName"]);
	header.appendChild(headerText);
	div.appendChild(header);

	let par = document.createElement("p");
	let parText = document.createTextNode("Rarity: " + data["rarity"]);
	par.appendChild(parText);
	div.appendChild(par);

	par = document.createElement("p");
	parText = document.createTextNode("Description: " + data["description"]);
	par.appendChild(parText);
	div.appendChild(par);

	return div;
}

function createDeadDropPopup(data: any): HTMLElement {
	const div = document.createElement("div");

	const header = document.createElement("h3");
	const headerText = document.createTextNode(data["ingame"]);
	header.appendChild(headerText);
	div.appendChild(header);

	let par = document.createElement("p");
	let parText = document.createTextNode("Description: " + data["description"]);
	par.appendChild(parText);
	div.appendChild(par);

	return div;
}

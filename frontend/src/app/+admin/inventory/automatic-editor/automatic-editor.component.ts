import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';

import { InventoryService } from '../../../_services/inventory.service';

import { InventoryItem } from '../../../_models/inventory-item';

declare var $: any;

@Component({
	moduleId: module.id,
	selector: 'item-editor',
	templateUrl: 'automatic-editor.component.html',
	styleUrls: ['automatic-editor.component.css'],

})
export class ItemAutomaticEditorComponent implements OnInit {

	private newItem: boolean = false;
	private items: InventoryItem[] = [];
	private item: InventoryItem = new InventoryItem();
	private disabled: boolean = true;
	private reset: boolean = false;
	private loading: boolean = false;

	constructor(private inventoryService: InventoryService) {}

	ngOnInit() {
		this.inventoryService.itemsSubject.subscribe((items) => {
			console.log(items);
			this.items = items;
		});
	}

	clean(){
		this.item = new InventoryItem();
		this.newItem = false;
		this.disabled = true;
	}

	search(event: any) {
		let code = this.item.code;
		for (let item of this.items) {
			if(item.code == code){
				this.newItem = false;
				this.inventoryService.getItem(item._id)
				.then((item: InventoryItem) => {
					this.item = item;
				});
				break;
			} else {
				let code = this.item.code;
				this.item = new InventoryItem();
				this.item.code = code;
				this.newItem = true
			}
		}
		this.disabled = false;
		this.next(event);
	}

	save() {
		this.loading = true;
		this.inventoryService.insertItem(this.item)
		.then((item: InventoryItem) => {
			this.clean();
			document.getElementById('0').focus();
			this.loading = false;
		});
	}

	update(event: any){
		this.loading = true;
		if(event.currentTarget.id == '5'){
			this.inventoryService.updateItem(this.item, this.reset)
			.then((item: InventoryItem) => {
				this.clean();
				document.getElementById('0').focus();
				this.loading = false;
			});
		}
	}

	back(event: any){
		document.getElementById((parseInt(event.currentTarget.id) - 1) + '').focus();
	}

	next(event: any){
		console.log("holaa");
		console.log(event.currentTarget.id);
		document.getElementById((parseInt(event.currentTarget.id) + 1) + '').focus();
	}

	selectMedia() {
		$('#media').modal('show');
	}

	selectedMedia(files: any[]) {
		this.item.icon = files[0]._id;
		$('#media').modal('hide');
	}
}
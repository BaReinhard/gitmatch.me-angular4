import { Component, OnInit } from '@angular/core';
import { RouterState } from '@angular/router';

@Component({
	selector: 'app-header',
	templateUrl: './header.component.html',
	styleUrls: ['./header.component.css'],
})
export class HeaderComponent implements OnInit {
	constructor() {}

	ngOnInit() {}

	collapsed = true; // store state
	toggleState = () => {
		this.collapsed = !this.collapsed;
	};
}

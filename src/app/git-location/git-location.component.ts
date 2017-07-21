import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScrollToService } from 'ng2-scroll-to-el';
@Component({
	selector: 'app-git-location',
	templateUrl: './git-location.component.html',
	styleUrls: ['./git-location.component.css'],
})
export class GitLocationComponent implements OnInit {
	gitLocationForm: FormGroup;
	showBottom: boolean = false;
	constructor(
		private results: ElementRef,
		private fb: FormBuilder,
		private scrollService: ScrollToService,
	) {
		this.gitLocationForm = fb.group({
			location: ['', Validators.compose([Validators.required])],
		});
	}
	ngOnInit() {}
	selectAll = el => {
		el.select();
	};
	show = element => {
		this.showBottom = !this.showBottom;
		setTimeout(() => {
			this.scrollService.scrollTo(
				this.results.nativeElement.querySelector('.results'),
			);
		}, 3000);
	};
}

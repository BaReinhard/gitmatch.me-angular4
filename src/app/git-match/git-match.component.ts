import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScrollToService } from 'ng2-scroll-to-el';

@Component({
	selector: 'app-git-match',
	templateUrl: './git-match.component.html',
	styleUrls: ['./git-match.component.css'],
})
export class GitMatchComponent implements OnInit {
	gitMatchForm: FormGroup;
	showBottom: boolean = false;
	constructor(
		private results: ElementRef,
		private fb: FormBuilder,
		private scrollService: ScrollToService,
	) {
		this.gitMatchForm = fb.group({
			username: ['', Validators.compose([Validators.required])],
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

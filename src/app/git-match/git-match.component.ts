import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScrollToService } from 'ng2-scroll-to-el';
import { GitMatchService } from '../git-match.service';

@Component({
	selector: 'app-git-match',
	templateUrl: './git-match.component.html',
	styleUrls: ['./git-match.component.css'],
})
export class GitMatchComponent implements OnInit {
	//Bools for Controlling Modals/Overlays/Loading
	loading: boolean = false;
	overlay: boolean = false;
	//Related to Overlays
	loadingText: string = 'Grabbing User Data';

	// Object of End User Data
	gitMatchUser; // {userData:{},repos:{}}
	gitMatchForm: FormGroup;
	showBottom: boolean = false;

	//Count for Expanded Search
	expandedSearchCount: number = 0;

	// Array of Local Developers User Data and Repos List
	localDevs = []; //Array of objects {userData:{},repos:{}}

	// Top Languages for End User
	topUserLanguages = []; //Array of objects {language:"JavaScript",count:"3"}
	constructor(
		private getMatchService: GitMatchService,
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
	show = () => {
		this.showBottom = true;
		setTimeout(() => {
			this.closeModals();
			this.scrollService.scrollTo(
				this.results.nativeElement.querySelector('.results'),
			);
		}, 3000);
	};
	setLoadingText = text => {
		this.loadingText = text;
	};
	openModals = () => {
		this.overlay = true;
		this.loading = true;
	};
	closeModals = () => {
		this.overlay = false;
		this.loading = false;
	};
	errorHandler = error => {
		console.log(error);
	};
	getUserData = (username, element) => {
		this.openModals();
		this.setLoadingText('Grabbing Your information');
		this.getMatchService.getUserName(username).subscribe(response => {
			let data = [];
			response.map((resdata: Response) => {
				data.push(resdata.json());
			});
			if (Array.isArray(data[0])) {
				this.getLocalUsers(data[1].location);
				this.gitMatchUser = { userData: data[1], repos: data[0] };
			} else {
				this.gitMatchUser = { userData: data[0], repos: data[1] };

				this.getLocalUsers(data[0].location);
			}

			// this.getLocalUsers()
			// this.show(element);
		}, this.errorHandler);
	};

	getLocalUsers = location => {
		this.setLoadingText('Getting local users');
		this.getMatchService
			.getLocalDevelopers(location)
			.subscribe(response => {
				let data = response.json();
				this.setLoadingText('Getting local users repos');
				this.getMatchService
					.getAllUserRepos(data.items)
					.subscribe(res => {
						this.expandedSearchCount++;
						res.map((data: Array<Response>) => {
							this.localDevs.push([data[0].json(), data[1].json()]);
						});
						if (
							this.localDevs.length >= 10 &&
							this.expandedSearchCount < 4
						) {
							this.formatLocalDevs(this.localDevs);
						} else {
							this.expandSearch(location);
						}
					}, this.errorHandler);
			});
	};
	expandSearch = location => {
		this.setLoadingText('Expanding Search');
		let newLocation = 'long beach';
		//Some New Location,
		if (location !== newLocation) {
			this.getLocalUsers(newLocation);
		}
	};
	formatLocalDevs = localDevs => {
		this.localDevs = localDevs.map(data => {
			if (Array.isArray(data[1])) {
				return { repos: data[1], userData: data[0] };
			} else {
				return { repos: data[0], userData: data[1] };
			}
		});
		this.calculateGitMatchUserRepos(this.gitMatchUser.repos);
	};
	calculateGitMatchUserRepos = repos => {
		this.setLoadingText('Parsing Languages');
		let uniqueLang = {};
		// Create and Weighted Unique Languages Object,

		repos.forEach(data => {
			if (
				uniqueLang[data.language] === undefined &&
				typeof data.language != typeof null
			) {
				uniqueLang[data.language] = 1;
			} else if (typeof data.language != typeof null) {
				uniqueLang[data.language] = uniqueLang[data.language] + 1;
			}
		});
		// From the Object into an array of objects
		for (var key in uniqueLang) {
			// skip loop if the property is from prototype
			if (!uniqueLang.hasOwnProperty(key)) continue;
			this.topUserLanguages.push({
				language: key,
				count: uniqueLang[key],
			});
		}
		//Orders Top Languages in Order
		this.topUserLanguages.sort((a: any, b: any) => {
			if (a.count < b.count) {
				return 1;
			} else if (b.count < a.count) {
				return -1;
			} else {
				return 0;
			}
		});
		this.calculateTopMatches(this.localDevs);
	};
	calculateTopMatches = localDevs => {
		this.setLoadingText('Calculating your top matches');
		console.log(localDevs, 'local devsssss');
		this.logAllData();
	};
	logAllData = () => {
		console.log('................................................');
		console.log('Performing logAllData()');
		console.log('................................................');

		console.log('GitMatch User Data: ', this.gitMatchUser);
		console.log('Local Devs Array: ', this.localDevs);
		console.log(
			'GitMatch User Top Repo Languages: ',
			this.topUserLanguages,
		);
		console.log('................................................');
		this.show();
	};
}

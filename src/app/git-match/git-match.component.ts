import { Component, OnInit, ElementRef } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ScrollToService } from 'ng2-scroll-to-el';
import { GitMatchService } from '../git-match.service';
import { COLORS } from '../.constants';

@Component({
	selector: 'app-git-match',
	templateUrl: './git-match.component.html',
	styleUrls: ['./git-match.component.css'],
})
export class GitMatchComponent implements OnInit {
	//Bools for Controlling Modals/Overlays/Loading
	loading: boolean = false;
	overlay: boolean = false;
	error: boolean = false;
	next: boolean = true;
	previous: boolean = false;
	//Related to Overlays
	loadingText: string = 'Grabbing User Data';
	errorText: string = '';
	// Object of End User Data
	gitMatchUser; // {userData:{},repos:{}}
	gitMatchForm: FormGroup;
	showBottom: boolean = false;
	GitUserData = {};
	currentGitMatchData = {};
	GitUserLabels = [];
	currentGitMatchLabels = [];
	GitUserType = 'pie';
	currentGitMatchType = 'pie';
	GitUserOptions = {};
	currentGitMatchOptions = {};
	currentGitMatchIndex = 0;

	languageToken = '';
	//Count for Expanded Search
	expandedSearchCount: number = 0;
	uniqueLang = {};
	// Used to
	GITMATCHFACTOR = 14.843474908426657;
	// Array of Local Developers User Data and Repos List
	localDevs = []; //Array of objects {userData:{},repos:{}}
	topMatches = []; // Array of Top Matches

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
	getLanguageToken = uniqueLang => {
		this.languageToken = '';
		console.log('UNIQUE LANGUAGES', uniqueLang);
		let topCount = uniqueLang[0].count;
		uniqueLang
			// .filter(l => {
			// 	return l.count + 7 >= topCount;
			// })
			.forEach(data => {
				this.languageToken +=
					'+language:' +
					encodeURIComponent(data.language.split(' ').join('-'));
			});
	};
	genChart = (element, type, gituserdata, gitmatchdata) => {
		console.log('element', element);
		console.log('Type', type);
		console.log('Data', gituserdata);
		let gituserdatas = [],
			gitusercolors = [];
		let gitmatchdatas = [],
			gitmatchcolors = [];
		// Gen GitUser Chart
		gituserdata.forEach(d => {
			gituserdatas.push(d.count);
			gitusercolors.push(COLORS[d.language].color);
			this.GitUserLabels.push(d.language);
		});

		this.GitUserType = 'pie';
		this.GitUserData = {
			labels: this.GitUserLabels,
			datasets: [
				{
					label: 'My First dataset',
					data: gituserdatas,
					backgroundColor: gitusercolors,
				},
			],
		};
		console.log('COLORS', gitusercolors);
		this.GitUserOptions = {
			responsive: true,
			maintainAspectRatio: false,
		};
		// Gen GitMatch Chart
		gitmatchdata.forEach(d => {
			gitmatchdatas.push(d.count);
			gitmatchcolors.push(COLORS[d.language].color);
			this.currentGitMatchLabels.push(d.language);
		});

		this.currentGitMatchType = 'pie';
		this.currentGitMatchData = {
			labels: this.currentGitMatchLabels,
			datasets: [
				{
					label: 'My First dataset',
					data: gitmatchdatas,
					backgroundColor: gitmatchcolors,
				},
			],
		};
		this.currentGitMatchOptions = {
			responsive: true,
			maintainAspectRatio: false,
		};
		setTimeout(() => {
			this.closeModals();
			this.scrollService.scrollTo(
				this.results.nativeElement.querySelector('.results'),
			);
		}, 3000);
	};
	switchGitMatchChart = index => {
		this.currentGitMatchIndex = index;
		if (this.currentGitMatchIndex < this.topMatches.length - 2) {
			this.next = true;
		}
		if (this.currentGitMatchIndex > 1) {
			this.previous = true;
		}
		if (this.currentGitMatchIndex < this.topMatches.length - 1) {
			this.currentGitMatchData = [];
			this.currentGitMatchLabels = [];
			this.currentGitMatchOptions = [];

			let gitmatchdata = this.topMatches[index].matchingLanguages;
			let gitmatchdatas = [],
				gitmatchcolors = [];
			// Gen GitMatch Chart
			gitmatchdata.forEach(d => {
				gitmatchdatas.push(d.count);
				gitmatchcolors.push(COLORS[d.language].color);

				this.currentGitMatchLabels.push(d.language);
			});

			this.currentGitMatchType = 'pie';
			this.currentGitMatchData = {
				labels: this.currentGitMatchLabels,
				datasets: [
					{
						label: 'My First dataset',
						data: gitmatchdatas,
						backgroundColor: gitmatchcolors,
					},
				],
			};
			this.currentGitMatchOptions = {
				responsive: true,
				maintainAspectRatio: false,
			};
		} else {
		}
	};

	clearAll() {
		this.localDevs = [];
		this.topMatches = [];
		this.uniqueLang = [];
		this.expandedSearchCount = 0;
		this.topUserLanguages = [];
		this.gitMatchUser = {};
	}
	selectAll = el => {
		el.select();
	};
	show = () => {
		console.log(this.localDevs[0]);
		console.log(this.topUserLanguages);
		this.showBottom = true;
		this.genChart(
			this.results.nativeElement.querySelector('#gitUserChart'),
			'bar',
			this.topUserLanguages,
			this.topMatches[0].matchingLanguages,
		);
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
		this.error = false;
	};
	errorHandler = error => {
		console.log(error);
		this.errorText = error;
		this.closeModals();
		this.error = this.overlay = true;
		setTimeout(() => {
			this.closeModals();
		}, 3000);
	};
	getUserData = (username, element) => {
		this.clearAll();
		this.openModals();
		this.setLoadingText('Grabbing Your information');
		this.getMatchService.getUserName(username).subscribe(response => {
			let data = [];
			response.map((resdata: Response) => {
				data.push(resdata.json());
			});
			if (Array.isArray(data[0])) {
				this.gitMatchUser = { userData: data[1], repos: data[0] };
			} else {
				this.gitMatchUser = { userData: data[0], repos: data[1] };
			}

			this.calculateGitMatchUserRepos(this.gitMatchUser.repos);
			this.getLocalUsers(
				this.gitMatchUser.userData.location,
				this.languageToken,
			);

			// this.getLocalUsers()
			// this.show(element);
		}, this.errorHandler);
	};

	getLocalUsers = (location, language) => {
		if (typeof location === typeof null) {
			this.errorHandler(
				'You have no location in your github profile, please set that and try again',
			);
		} else {
			// console.log('getLocal');
			this.setLoadingText('Getting local users');
			this.getMatchService
				.getLocalDevelopers(location, language)
				.subscribe(response => {
					console.log(response);
					let data = response.json();
					this.setLoadingText('Getting local users repos');
					if (data.total_count === 0) {
						this.expandSearch(location);
					} else {
						this.getMatchService
							.getAllUserRepos(data.items)
							.subscribe(res => {
								// console.log(res);
								this.expandedSearchCount++;
								if (res.length === 0) {
								} else {
									res.map((data: Array<Response>) => {
										this.localDevs.push([
											data[0].json(),
											data[1].json(),
										]);
									});
								}

								console.log(this.localDevs);
								if (
									this.localDevs.length >= 10 &&
									this.expandedSearchCount < 4
								) {
									this.formatLocalDevs(this.localDevs);
								} else {
									this.expandSearch(location);
								}
							}, this.errorHandler);
					}
				});
		}
	};
	expandSearch = location => {
		this.setLoadingText('Expanding Search');
		let newLocation = 'long beach';
		console.log(`Expanded Search to ${newLocation}`);
		//Some New Location,
		if (location !== newLocation) {
			this.getLocalUsers(newLocation, this.languageToken);
		}
	};
	formatLocalDevs = localDevs => {
		// console.log('format local devs');
		this.localDevs = this.localDevs.map(data => {
			if (Array.isArray(data[1])) {
				return {
					repos: data[1],
					userData: data[0],
					matchingLanguages: {},
				};
			} else {
				return {
					repos: data[0],
					userData: data[1],
					matchingLanguages: {},
				};
			}
		});
		this.localDevs = this.localDevs.filter(data => {
			// console.log(data);
			if (data.userData.login === this.gitMatchUser.userData.login) {
				return false;
			} else {
				return true;
			}
		});
		this.calculateTopMatches(this.localDevs);

		// console.log('Check out localDevs now', this.localDevs);
		// this.calculateGitMatchUserRepos(this.gitMatchUser.repos);
	};
	calculateGitMatchUserRepos = repos => {
		this.setLoadingText('Parsing Languages');
		this.uniqueLang = {};
		// Create and Weighted Unique Languages Object,

		repos.forEach(data => {
			if (
				this.uniqueLang[data.language] === undefined &&
				typeof data.language != typeof null
			) {
				this.uniqueLang[data.language] = 1;
			} else if (typeof data.language != typeof null) {
				this.uniqueLang[data.language] =
					this.uniqueLang[data.language] + 1;
			}
		});
		// From the Object into an array of objects
		for (var key in this.uniqueLang) {
			// skip loop if the property is from prototype
			if (!this.uniqueLang.hasOwnProperty(key)) continue;
			this.topUserLanguages.push({
				language: key,
				count: this.uniqueLang[key],
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
		this.getLanguageToken(this.topUserLanguages);
		// this.calculateTopMatches(this.localDevs);
	};
	calculateTopMatches = localDevs => {
		this.setLoadingText('Calculating your top matches');
		// console.log(localDevs, 'local devsssss');

		this.topMatches = localDevs.filter(data => {
			// console.log(data);
			if (data.repos.length > 0) {
				return true;
			} else {
				return false;
			}
		});
		this.topMatches.map(data => {
			let repoScore = 1;
			data.repos.forEach(repo => {
				if (this.uniqueLang[repo.language] !== undefined) {
					repoScore = repoScore + this.uniqueLang[repo.language];
					// console.log(data.matchingLanguages);
					if (data.matchingLanguages[repo.language] === undefined) {
						data.matchingLanguages[repo.language] = 1;
					} else {
						data.matchingLanguages[repo.language] =
							data.matchingLanguages[repo.language] + 1;
					}
				}
			});
			data.score = Math.log(repoScore) * this.GITMATCHFACTOR;
			let matchingLanguagesHolder = [];
			for (var key in data.matchingLanguages) {
				// skip loop if the property is from prototype
				if (!data.matchingLanguages.hasOwnProperty(key)) continue;
				matchingLanguagesHolder.push({
					language: key,
					count: data.matchingLanguages[key],
				});
			}
			data.matchingLanguages = matchingLanguagesHolder;
			data.matchingLanguages.sort((a, b) => {
				if (a.count < b.count) {
					return 1;
				} else if (a.count > b.count) {
					return -1;
				} else {
					return 0;
				}
			});
		});
		console.log('Show me matching languages', this.topMatches);
		this.topMatches.sort((a, b) => {
			if (a.score < b.score) {
				return 1;
			} else if (a.score > b.score) {
				return -1;
			} else {
				return 0;
			}
		});
		this.topMatches.forEach(data => {
			// console.log('Matching Score', data.score);
		});
		// console.log(this.topMatches, 'Filtered Top matches');
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

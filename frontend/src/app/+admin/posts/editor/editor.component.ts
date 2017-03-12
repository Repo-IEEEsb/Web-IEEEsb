import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeHtml} from '@angular/platform-browser';

import { ContentService } from '../../../_services/content.service';

import { PostData } from '../../../_models/post';

@Component({
	moduleId: module.id,
	selector: 'editor',
	templateUrl: './editor.component.html',
	styleUrls: ['./editor.component.css']
})
export class PostEditorComponent implements OnInit {

	private post: PostData = new PostData();
	private sub: any;

	constructor(private router: Router, private route: ActivatedRoute, private sanitizer: DomSanitizer, private contentService: ContentService) {}

	ngOnInit() {
		this.sub = this.route.params.subscribe(params => {
			if (params['id']) {
				this.contentService.getPost(params['id'])
				.then((post: PostData) => {
					this.post = post;
				});
			}
		});
	}

	get content(){
		return this.sanitizer.bypassSecurityTrustHtml(this.post.content);
	}

	get excerpt(){
		return this.post.excerpt.replace(/<br \/>/g, "\n");
	}

	set excerpt(excerpt){
		this.post.excerpt = excerpt.replace(/\n/g, "<br />");
	}

	save() {
		this.contentService.savePost(this.post)
		.then((post: PostData) => {
			if(this.post._id){
				this.contentService.getPost(this.post._id)
				.then((post: PostData) => {
					this.post = post;
				});
			} else {
				this.router.navigate(["/admin/posts/post/" + post._id]);
			}
		});
	}

	remove() {
		this.contentService.removePost(this.post._id)
		.then((post: PostData) => {
			this.post = post;
			this.router.navigate(["/admin/posts/"]);
		});
	}

	publish() {
		this.contentService.publishPost(this.post._id)
		.then(() => {
			this.contentService.getPost(this.post._id)
			.then((post: PostData) => {
				this.post = post;
			});
		});
	}
}

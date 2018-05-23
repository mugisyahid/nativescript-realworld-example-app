import { Component, OnInit, ViewChild, ElementRef } from "@angular/core";
import { Router } from "@angular/router";
import { AbstractHttpService } from "~/service/AbstractHttpService";
import { setString, getString } from "tns-core-modules/application-settings/application-settings";
import { Feedback } from "nativescript-feedback";
import { localize } from "nativescript-localize";
import * as isURL from "validator/lib/isURL";

@Component({
    selector: "conduit-settings",
    moduleId: module.id,
    templateUrl: "./settings.component.html",
    styleUrls: ["./home.css"]
})
export class SettingsComponent implements OnInit {
    /** */
    private feedback: Feedback;
    /** */
    public url: string;
    /** */
    @ViewChild("txtUrl") protected txtUrl: ElementRef;

    /**
     *
     * @param router
     */
    constructor(protected router: Router) {
        this.feedback = new Feedback();
    }

    /**
     *
     */
    public ngOnInit() {
        this.url = getString("apiUrl");
    }

    /**
     *
     */
    public onSave() {
        if (!this.txtUrl.nativeElement.text || !isURL(this.txtUrl.nativeElement.text)) {
            this.feedback.warning({
                title: localize("error.general"),
                message: localize("settings.urlWarning")
            });
            return;
        }
        this.save(this.txtUrl.nativeElement.text);
    }

    /**
     * Reset the backend url back to the productionready.io url
     */
    public onReset() {
        this.save(AbstractHttpService.PRODUCTIONREADY_IO_API_BASE_URL);
    }

    /**
     *
     * @param url
     */
    protected save(url) {
        setString("apiUrl", url);
        this.url = url;
    }
}

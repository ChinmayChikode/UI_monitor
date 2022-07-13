import {Injectable} from "@angular/core";

@Injectable()
export class SidenavService {

    private toggleButtonStatus: boolean = false;
    private toggleIconChange: boolean = false;

    constructor() {}

    setToggleButtonStatus(toggleButtonStatus) {
        this.toggleButtonStatus = toggleButtonStatus;
    }

    getToggleButtonStatus() {
        return this.toggleButtonStatus ;
    }

    setToggleIconChange(toggleIconChange) {
        this.toggleIconChange = toggleIconChange;
    }

    getToggleIconChange() {
        return this.toggleIconChange ;
    }
}
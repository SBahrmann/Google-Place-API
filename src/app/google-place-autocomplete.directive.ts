import { AfterViewInit, Directive, ElementRef, EventEmitter, Input, NgZone, Output } from "@angular/core";

export type LatLngLiteral = { lat: number; lng: number }
export type LatLngBoundsLiteral = { east: number; north: number; south: number; west: number }

export interface AddressComponent {
    long_name: string;
    short_name: string;
    types: string[];
}

export interface Geometry {
    location: LatLng;
    viewport: LatLngBounds;
}

export interface LatLng {
    equals(other: LatLng): boolean;
    lat(): number;
    lng(): number;
    toString(): string;
    toUrlValue(precision?: number): string;
    toJSON(): LatLngLiteral;
}

export interface LatLngBounds {
    contains(latLng: LatLng | LatLngLiteral): boolean;
    equals(other: LatLngBounds | LatLngBoundsLiteral): boolean;
    extend(point: LatLng | LatLngLiteral): LatLngBounds;
    getCenter(): LatLng;
    getNorthEast(): LatLng;
    getSouthWest(): LatLng;
    intersects(other: LatLngBounds | LatLngBoundsLiteral): boolean;
    isEmpty(): boolean;
    toJSON(): LatLngBoundsLiteral;
    toSpan(): LatLng;
    toString(): string;
    toUrlValue(precision?: number): string;
    union(other: LatLngBounds | LatLngBoundsLiteral): LatLngBounds;
}

export interface OpeningHours {
    open_now: boolean;
    periods: OpeningPeriod[];
    weekday_text: string[];
}

export interface OpeningPeriod {
    open: OpeningHoursTime;
    close?: OpeningHoursTime;
}

export interface OpeningHoursTime {
    day: number;
    hours: number;
    minutes: number;
    nextDate: number;
    time: string;
}

export interface Photo {
    height: number;
    html_attributions: string[];
    width: number;

    getUrl(request: PhotoRequest): string;
}

export interface PlaceReview {
    aspects: PlaceAspectRating[];
    author_name: string;
    author_url: string;
    profile_photo_url: string;
    language: string;
    text: string;
    rating: string;
    relative_time_description: string;
}

export interface PlaceAspectRating {
    rating: number;
    type: string;
}

declare let google: any;

@Directive({
    selector: '[google-places-autocomplete]',
    exportAs: 'google-places'
})

export class GooglePlaceDirective implements AfterViewInit {
    @Input('options') options!: Options;
    @Output() onAddressChange: EventEmitter<Address> = new EventEmitter();
    private autocomplete: any;
    private eventListener: any;
    public place!: Address;
    google: any;

    constructor(private el: ElementRef, private ngZone: NgZone) {
    }

    ngAfterViewInit(): void {
        if (!this.options)
            this.options = new Options();

        this.initialize();
    }

    private isGoogleLibExists(): boolean {
        if (!google?.maps?.places) {
            alert('Please reload');
        }
        return google?.maps?.places;
    }

    private initialize(): void {
        if (!this.isGoogleLibExists())
            throw new Error("Google maps library can not be found");

        this.autocomplete = new google.maps.places.Autocomplete(this.el.nativeElement, this.options);

        if (!this.autocomplete)
            throw new Error("Autocomplete is not initialized");

        if (!this.autocomplete.addListener != null) { // Check to bypass https://github.com/angular-ui/angular-google-maps/issues/270
            this.eventListener = this.autocomplete.addListener('place_changed', () => {
                this.handleChangeEvent()
            });
        }

        this.el.nativeElement.addEventListener('keydown', (event: KeyboardEvent) => {
            if (!event.key) {
                return;
            }

            let key = event.key.toLowerCase();

            if (key == 'enter' && event.target === this.el.nativeElement) {
                event.preventDefault();
                event.stopPropagation();
            }
        });

        // according to https://gist.github.com/schoenobates/ef578a02ac8ab6726487
        if (window && window.navigator && window.navigator.userAgent && navigator.userAgent.match(/(iPad|iPhone|iPod)/g)) {
            setTimeout(() => {
                let containers = document.getElementsByClassName('pac-container');

                if (containers) {
                    let arr = Array.from(containers);

                    if (arr) {
                        for (let container of arr) {
                            if (!container)
                                continue;

                            container.addEventListener('touchend', (e) => {
                                e.stopImmediatePropagation();
                            });
                        }

                    }
                }
            }, 500);
        }
    }

    public reset(): void {
        this.autocomplete.setComponentRestrictions(this.options.componentRestrictions);
        this.autocomplete.setTypes(this.options.types);
    }

    private handleChangeEvent(): void {
        this.ngZone.run(() => {
            this.place = this.autocomplete.getPlace();

            if (this.place) {
                this.onAddressChange.emit(this.place);
            }
        });
    }
}

export class Address {
    address_components: AddressComponent[] = [];
    adr_address: string = '';
    formatted_address: string = '';
    formatted_phone_number: string = '';
    geometry!: Geometry;
    html_attributions: string[] = [];
    icon: string = '';
    id: string = '';
    international_phone_number: string = '';
    name: string = '';
    opening_hours!: OpeningHours;
    permanently_closed: boolean = false;
    photos: Photo[] = [];
    place_id: string = '';
    price_level: number = 0;
    rating: number = 0;
    reviews: PlaceReview[] = [];
    types: string[] = [];
    url: string = '';
    utc_offset: number = 0;
    vicinity: string = '';
    website: string = '';
}

export class Options {
    public bounds!: LatLngBounds;
    public componentRestrictions!: ComponentRestrictions;
    public types!: string[];
    public fields!: string[];
    public strictBounds!: boolean;
    public origin!: LatLng;
    public constructor(opt?: Partial<Options>) {
        if (!opt)
            return;

        Object.assign(this, opt);
    }
}

export class ComponentRestrictions {
    public country: string = '';

    constructor(obj?: Partial<ComponentRestrictions>) {
        if (!obj)
            return;

        Object.assign(this, obj);
    }
}

export class PhotoRequest {
    public maxWidth: number = 0;
    public maxHeight: number = 0;
}
// Location Sharing Functionality
class LocationSystem {
    constructor() {
        this.isSharing = false;
        this.locationInterval = null;
        this.currentLocation = null;
        this.init();
    }

    init() {
        this.getLocationBtn = document.getElementById('getLocationBtn');
        this.shareLocationBtn = document.getElementById('shareLocationBtn');
        this.stopSharingBtn = document.getElementById('stopSharingBtn');
        this.locationStatus = document.getElementById('locationStatus');
        this.locationStatusText = document.getElementById('locationStatusText');
        this.mapPlaceholder = document.getElementById('mapPlaceholder');

        this.bindEvents();
    }

    bindEvents() {
        if (this.getLocationBtn) {
            this.getLocationBtn.addEventListener('click', () => this.getCurrentLocation());
        }

        if (this.shareLocationBtn) {
            this.shareLocationBtn.addEventListener('click', () => this.startSharing());
        }

        if (this.stopSharingBtn) {
            this.stopSharingBtn.addEventListener('click', () => this.stopSharing());
        }
    }

    async getCurrentLocation() {
        if (!navigator.geolocation) {
            alert('Geolocation is not supported by this browser.');
            return;
        }

        try {
            const position = await new Promise((resolve, reject) => {
                navigator.geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 10000,
                    maximumAge: 0
                });
            });

            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            this.currentLocation = { lat, lng };
            this.updateLocationDisplay(lat, lng);
            this.enableSharing();

        } catch (error) {
            console.error('Geolocation error:', error);
            alert('Unable to retrieve your location. Please ensure location services are enabled.');
        }
    }

    updateLocationDisplay(lat, lng) {
        if (this.mapPlaceholder) {
            this.mapPlaceholder.innerHTML = `
                <i class="fas fa-map-marker-alt" style="color: var(--primary); font-size: 2rem; margin-bottom: 10px;"></i>
                <p>Location acquired</p>
                <p style="font-size: 0.9rem; margin-top: 5px;">Lat: ${lat.toFixed(6)}<br>Lng: ${lng.toFixed(6)}</p>
            `;
        }
    }

    enableSharing() {
        if (this.shareLocationBtn) {
            this.shareLocationBtn.disabled = false;
        }

        if (this.locationStatus) {
            this.locationStatus.className = 'status-indicator active';
        }

        if (this.locationStatusText) {
            this.locationStatusText.textContent = 'Location ready to share';
        }
    }

    startSharing() {
        if (!this.currentLocation) return;

        this.isSharing = true;
        
        // Update UI
        if (this.shareLocationBtn) this.shareLocationBtn.disabled = true;
        if (this.stopSharingBtn) this.stopSharingBtn.disabled = false;
        if (this.getLocationBtn) this.getLocationBtn.disabled = true;
        
        if (this.locationStatusText) {
            this.locationStatusText.textContent = 'Sharing location with emergency contacts';
        }

        // Start sharing location periodically
        this.locationInterval = setInterval(() => {
            this.shareLocationUpdate();
        }, 5000);

        // Log the start of location sharing
        this.logLocationSharingStart();
        
        alert('Your location is now being shared with emergency contacts and campus security.');
    }

    shareLocationUpdate() {
        if (!this.currentLocation) return;

        // In a real app, this would send location updates to the server
        const locationData = {
            timestamp: new Date().toISOString(),
            location: this.currentLocation,
            type: 'LOCATION_UPDATE'
        };

        console.log('Location shared:', locationData);
        
        // Simulate sending to backend
        // makeAPICall('/api/location-update', locationData);
    }

    stopSharing() {
        this.isSharing = false;
        
        // Update UI
        if (this.shareLocationBtn) this.shareLocationBtn.disabled = false;
        if (this.stopSharingBtn) this.stopSharingBtn.disabled = true;
        if (this.getLocationBtn) this.getLocationBtn.disabled = false;
        
        if (this.locationStatus) {
            this.locationStatus.className = 'status-indicator';
        }
        
        if (this.locationStatusText) {
            this.locationStatusText.textContent = 'Location sharing stopped';
        }

        // Clear interval
        if (this.locationInterval) {
            clearInterval(this.locationInterval);
            this.locationInterval = null;
        }

        // Log the stop of location sharing
        this.logLocationSharingStop();
        
        alert('Location sharing has been stopped.');
    }

    logLocationSharingStart() {
        const eventData = {
            type: 'LOCATION_SHARING_STARTED',
            location: this.currentLocation,
            timestamp: new Date().toISOString()
        };
        
        logEmergencyEvent(eventData);
    }

    logLocationSharingStop() {
        const eventData = {
            type: 'LOCATION_SHARING_STOPPED',
            timestamp: new Date().toISOString()
        };
        
        logEmergencyEvent(eventData);
    }
}

// Initialize location system when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    new LocationSystem();
});
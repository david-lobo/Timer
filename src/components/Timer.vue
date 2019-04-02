<template>
<div>
    <div class="row form-group" v-if="showTimeInputs">
        <div class="col">
            <input @change="timeEntered" v-model="selectedTime.hours" id="hours" name="hours" type="number" class="form-control text-center" placeholder="0" min="0" max="24">
            <label for="hours" class="mt-2 small text-uppercase font-weight-bold text-muted">Hours</label>
        </div>
        <div class="col">
            <input @change="timeEntered" v-model="selectedTime.minutes" id="minutes" name="minutes" type="number" class="form-control text-center" placeholder="0" min="0" max="59">
            <label for="hours" class="mt-2 small text-uppercase font-weight-bold text-muted">Minutes</label>
        </div>
        <div class="col">
            <input @change="timeEntered" v-model="selectedTime.seconds" id="seconds" name="seconds" type="number" class="form-control text-center" placeholder="0" min="0" max="59">
            <label for="hours" class="mt-2 small text-uppercase font-weight-bold text-muted">Seconds</label>
        </div>
    </div>
    <div class="time-text d-flex justify-content-center" v-else>
        <div @click="timeInputClicked" class="digits hours">{{ currentTime.hours | timeForDisplay }}</div>
        <div class="digits-divider">:</div>
        <div @click="timeInputClicked" class="digits minutes">{{ currentTime.minutes | timeForDisplay }}</div>
        <div class="digits-divider">:</div>
        <div @click="timeInputClicked" class="digits seconds">{{ currentTime.seconds | timeForDisplay }}</div>
    </div>
    <hr>
    <div v-if="done" class="alert alert-success" role="alert">
        Timer Done
    </div>
    <form>
        <div class="row form-group">
            <div class="col">
                <select class="form-control" @change="timeSelected" v-model="timeSelectedIndex">
                    <option disabled value="">Custom</option>
                    <option v-for="(time, index) in durationList" :value="index">{{ time.label }}</option>
                </select>
            </div>
            <div class="col text-left">
                <button @click="muted = !muted" type="button" class="btn btn-md btn-outline btn-outline-secondary mr-auto">
                    <font-awesome-icon :icon="muted ? 'volume-mute' : 'volume-up'" />
                </button>
            </div>
        </div>
        <div class="row form-group">
            <div class="col-6">
                <button @click.stop.prevent="toggleStart" class="btn w-100" :class="[started ? 'btn-secondary' : 'btn-success' ]">
                {{ started ? 'Pause' : 'Start' }}
                </button>
            </div>
            <div class="col-6">
                <button @click.stop.prevent="cancel" class="btn btn-danger ml-auto w-100">
                Cancel
                </button>
            </div>
        </div>
    </form>
</div>

</template>

<script>

	export default {
		data() {
			let defaultTime = this.secondsToHms(5 * 60);
			let defaultTimeInSecs = 5 * 60;
			return {
				timeSelectedIndex: 0,
				showTimeInputs: false,
				timeInputs: null,
				alarm: null,
				alarmUrl: "./../../beep-07.wav",
				timerInterval: null,
				muted: false,
				started: false,
				done: false,
				selectedTime: defaultTime,
				currentTimeInSecs: defaultTimeInSecs,
				timeInMins: [5, 10, 15, 20, 25, 30, 45, 60
				]
			}
		},
		computed: {
			currentTime() {
				return this.secondsToHms(this.currentTimeInSecs);
			},
			durationList() {
				let d = [];
				this.timeInMins.forEach((time) => {
					d.push({
						label: time + ' min',
						time: this.secondsToHms(time * 60)
					});
				})
				console.log(d);
				return d;
			}
		},
		methods: {
			toggleStart() {
				this.done = false;
				if (this.started) {
					this.pause();
				} else {
					this.started = true;
					this.showTimeInputs = false;
					this.startCounter();
				}
			},
			pause() {
				this.done = false;
				if (this.started) {
					this.started = !this.started;
					clearInterval(this.timerInterval);
				}
			},
			cancel() {
				this.showTimeInputs = false;
				this.selectedTime = this.durationList[this.timeSelectedIndex].time;
				this.timeChanged();
			},
			startCounter() {
				let vm = this;
				vm.timerInterval = setInterval(() => {
					if (vm.currentTimeInSecs === 0) {
						this.done = true;
						this.started = false;
						clearInterval(this.timerInterval);
						if (!this.muted) {
							vm.soundAlarm();
						}
					} else {
						vm.currentTimeInSecs--;
					}
				}, 1000);
			},
			timeEntered() {
				let secs = this.selectedTime.seconds;
				let mins = this.selectedTime.minutes * 60;
				let hours = this.selectedTime.hours * 60 * 60;
				let time  = parseInt(secs) + parseInt(mins) + parseInt(hours);
				this.selectedTime.timeInSecs = time;
				this.timeChanged();
			},
			timeSelected(newTime) {
				this.selectedTime = this.durationList[newTime.target.value].time;
				this.timeChanged();
			},
			timeInputClicked() {
				this.pause();
				this.showTimeInputs = !this.showTimeInputs;
				this.selectedTime = this.secondsToHms(this.currentTimeInSecs);
			},
			timeChanged() {
				this.pause();
				this.started = false;
				this.currentTimeInSecs = this.selectedTime.timeInSecs;
			},
			secondsToHms(d) {
			    d = Number(d);
			    let h = Math.floor(d / 3600);
			    let m = Math.floor(d % 3600 / 60);
			    let s = Math.floor(d % 3600 % 60);
			    let time = {
			    	hours: h,
			    	minutes: m,
			    	seconds: s,
			    	timeInSecs: d
			    };

			    return time;
				},
				soundAlarm() {
					let vm = this;
					
					setTimeout(() => {
						vm.alarm.pause();
					}, 5000);

					this.playAlarm();
				},
				playAlarm() {
					this.alarm.play();
				},
			},
			filters: {
				timeForDisplay(value) {
					return value < 10 ? '0' + value : value;
				}
			},
			created() {
				if(this.alarmUrl) {
	        this.alarm = new Audio(this.alarmUrl);
	        this.alarm.loop = true;
	      }
			}
	}
</script>

<style scoped>
	.btn-outline {
		border-radius: .25rem;
	}
	.btn-outline-secondary:hover, .btn-outline-secondary:active {
		background-color: transparent !important;
		box-shadow: inset 0 0 0 20rem rgba(0,0,0,.0625) !important;
		color: inherit !important;
		outline: none;
	}

</style>
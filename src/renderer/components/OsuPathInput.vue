<template>
	<b-row>
		<b-col>
			<b-row align-h="center"
			       class="pt-4">
				<b-col cols="4">
					<b-img src="static/logo.png"></b-img>
				</b-col>
			</b-row>
			<b-row align-h="center"
			       class="pt-4">
				<b-col>
					<b-input-group prepend="Osu! Songs folder path:">
						<b-form-input v-model="pathinput"></b-form-input>
						<b-input-group-append>
							<b-btn variant="secondary"
							       @click="select">Select</b-btn>
							<b-btn variant="primary"
							       @click="setPath(pathinput)">Set</b-btn>
						</b-input-group-append>
					</b-input-group>
				</b-col>
			</b-row>
		</b-col>
	</b-row>
</template>
<script>
import { mapState } from 'vuex'
import { remote } from 'electron'
const { dialog } = remote

export default {
	data() {
		return {
			pathinput: ''
		}
	},
	computed: mapState(['osupath']),
	methods: {
		setPath(path) {
			this.$store.dispatch('updateOsupath', path)
		},
		select() {
			const r = dialog.showOpenDialog({ properties: ['openDirectory'] })
			if (r && r.length) {
				this.pathinput = r[0]
			}
		}
	}
}
</script>

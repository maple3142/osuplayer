<template>
	<b-row>
		<b-col>
			<b-row align-h="center"
			       class="pt-4">
				<b-col cols="4"
				       class="text-center">
					<b-img src="static/logo.png"></b-img>
				</b-col>
			</b-row>
			<b-row align-h="center"
			       class="pt-4">
				<b-col v-if="!IS_WEB">
					<b-form-file @change="setPath($event.target.files[0].path)"
					             placeholder="Choose your osu! Songs directory."
					             directory></b-form-file>
				</b-col>
				<b-col v-else>
					<b-form-file @change="onDirectory($event.target.files)"
					             placeholder="Choose your osu! Songs directory."
					             directory></b-form-file>
				</b-col>
			</b-row>
		</b-col>
	</b-row>
</template>
<script>
import { actions, mutations } from '../store/ops'
import { mapState } from 'vuex'
import listgen from '../listgenfromfilelist'

export default {
	data() {
		return {
			pathinput: '',
			files: []
		}
	},
	computed: mapState(['osupath']),
	methods: {
		setPath(path) {
			this.$store.dispatch(actions.updateOsupath, path)
		},
		async onDirectory(files) {
			if (!files || files.length === 0) return
			const list = await listgen(files)
			this.$store.commit(mutations.setList, list)
			this.$store.commit(mutations.setShowpathinput, false)
		}
	}
}
</script>

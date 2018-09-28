<template>
	<b-list-group-item @click="$emit('play', music)"
	                   :active="active">
		<a :class="{'text-white':active}"
		   :href="beatMapUrl"
		   @click.prevent.stop="openUrl(beatMapUrl)">{{music.title}}</a>
		<b-img class="pic"
		       src="/static/picture.svg"
		       v-b-modal.imgModal
			   @click.stop="setModalMusic" />
	</b-list-group-item>
</template>
<script>
import { shell } from 'electron'

export default {
	props: {
		music: {
			type: Object,
			required: true
		},
		active: {
			type: Boolean
		}
	},
	methods: {
		setModalMusic() {
			this.$store.commit('setModalMusic', this.music)
		},
		openUrl(url) {
			shell.openExternal(url)
		}
	},
	computed: {
		beatMapUrl() {
			return 'https://osu.ppy.sh/beatmapsets/' + this.music.id
		}
	}
}
</script>
<style>
.pic {
	display: inline-block;
	height: 24px;
}
</style>

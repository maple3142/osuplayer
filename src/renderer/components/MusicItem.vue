<template>
	<b-list-group-item @click="$emit('play', music)"
	                   :active="active">
		<a :class="{'text-white':active}"
		   :href="beatMapUrl"
		   @click.prevent.stop="openUrl(beatMapUrl)">{{music.titleUnicode || music.title}}</a>
		<b-img class="pic"
		       :src="picture"
		       v-b-modal.imgModal
		       @click.stop="setModalMusic" />
	</b-list-group-item>
</template>
<script>
import { shell } from 'electron'
import picture from '../assets/picture.svg'
import { mutations } from '../store/ops'

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
			this.$store.commit(mutations.setModalMusic, this.music)
		},
		openUrl(url) {
			shell.openExternal(url)
		}
	},
	computed: {
		beatMapUrl() {
			return 'https://osu.ppy.sh/beatmapsets/' + this.music.id
		},
		picture() {
			return picture
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

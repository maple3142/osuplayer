<template>
	<b-modal id="imgModal"
			 no-fade
	         :title="modalMusic.titleUnicode || modalMusic.title"
	         :hide-header-close="true"
			 :ok-only="true"
	         ok-title="Close">
		<b-img fluid
		       :src="modalMusic.bg || ''" />
	</b-modal>
</template>
<script>
import { mapState, mapMutations } from 'vuex'
export default {
	computed: mapState(['modalMusic'])
}
</script>

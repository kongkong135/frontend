<template>
  <div>
    <el-dropdown @command="handleCommand" v-if="showHeader">
      <span class="el-dropdown-link">
        <el-icon :size="20">
          <component :is="currentIcon" />
        </el-icon>
      </span>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item command="showFriends">显示朋友列表</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
    <el-dialog
      title="朋友列表"
      v-model="dialogVisible"
      width="30%"
      @close="handleDialogClose"
    >
      <FriendList @open-chat="openChat" />
    </el-dialog>
  </div>
</template>

<script>
import FriendList from '@/components/FriendList.vue';
import { ElDropdown, ElDropdownMenu, ElDropdownItem, ElDialog } from 'element-plus';
import { Search, User } from '@element-plus/icons-vue'; // 导入多个图标
import { defineComponent } from 'vue';

export default defineComponent({
  components: {
    ElDropdown,
    ElDropdownMenu,
    ElDropdownItem,
    ElDialog,
    FriendList,
    Search,
    User
  },
  props: {
    showHeader: {
      type: Boolean,
      default: true
    }
  },
  data() {
    return {
      dialogVisible: false,
      currentIcon: 'Search' // 默认图标为 Search
    };
  },
  methods: {
    handleCommand(command) {
      if (command === 'showFriends') {
        this.dialogVisible = true;
      }
    },
    openChat(friend) {
      if (!friend || !friend.id) {
        console.error('Invalid friend object or missing friendId');
        return;
      }
      this.dialogVisible = false;
      this.$router.push({ name: 'Chat', params: { friendId: friend.id } });
    },
    handleDialogClose() {
      this.dialogVisible = false;
    }
  }
});
</script>

<style>
.el-dropdown-link {
  cursor: pointer;
  color: #409EFF;
}
</style>

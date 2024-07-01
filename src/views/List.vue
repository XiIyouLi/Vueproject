<template>
    <div class="text-left">
        <div class="text-3xl text-center h-16 leading-loose">同学列表</div>
        <div class="flex justify-end mb-2">
            <button class="text-white w-20 mr-10 h-10 bg-gray-700" type="primary" @click="addUser">新 增</button>
        </div>
        <ul class="text-center px-10">
            <li class="list-none flex justify-start items-center h-16 text-white bg-gray-500">
                <span class="w-1/5">序号</span>
                <span class="w-1/5">学号</span>
                <span class="w-1/5">姓名</span>
                <span class="w-1/5">年龄</span>
                <div class="flex grow justify-around">操作</div>
            </li>
            <li v-for="(item, index) in userList" :key="item.id" class="list-none flex justify-start items-center h-16 border-b border-solid border-gray-700">
                <span class="w-1/5">{{ index + 1 }}</span>
                <span class="w-1/5">{{ item.id }}</span>
                <span class="w-1/5">{{ item.userName }}</span>
                <span class="w-1/5">{{ item.age }}</span>
                <div class="flex grow justify-around">
                    <button class="text-white w-20 h-10 bg-gray-700" @click="deleteUser(index)">删除</button>
                    <button class="text-white w-20 h-10 bg-gray-700" @click="editUser(index)">编辑</button>
                    <button class="text-white w-20 h-10 bg-gray-700" @click="getYourName(item.id)">问名字</button>
                </div>
            </li>
        </ul>

        <div class="border-gray-700 absolute bg-white rounded-lg top-1/2 left-1/2 w-1/3 h-1/2 -translate-x-1/2 -translate-y-1/2 p-6 border border-solid flex flex-col" v-if="showFlag">
            <div class="text-center text-2xl">{{ isEdit ? '编辑同学' : '新增同学' }}</div>
            <div class="grow shrink flex flex-col justify-center">
                <div class="flex h-20 text-2xl items-center">
                    <span class="mr-3 text-xl">学号</span>
                    <input class="grow shrink h-9 text-xl border border-solid border-black" type="text" v-model="studyNum" />
                </div>
                <div class="flex h-20 text-2xl items-center">
                    <span class="mr-3 text-xl">姓名</span>
                    <input class="grow shrink h-9 text-xl border border-solid border-black" type="text" v-model="name" />
                </div>
                <div class="flex h-20 text-2xl items-center">
                    <span class="mr-3 text-xl">年龄</span>
                    <input class="grow shrink h-9 text-xl border border-solid border-black" type="text" v-model="year" />
                </div>
            </div>
            <div class="flex justify-end w-full">
                <button class="mr-3 bg-white border border-solid border-blue-500 text-blue-500 w-20 h-10" @click="cancelFn">取消</button>
                <button class="text-white bg-blue-500 w-20 h-10" @click="submitFn">确定</button>
            </div>
        </div>
    </div>
</template>

<script setup>
    import { ref } from 'vue';
    import { storeToRefs } from 'pinia';
    import { useUserStore } from '@/store/user';

    const userStore = useUserStore();
    const { userList } = storeToRefs(userStore);

    let showFlag = ref(false);
    let isEdit = ref(false);
    let curIdx = ref(0);

    let studyNum = ref(0);
    let name = ref('');
    let year = ref(0);

    const deleteUser = (index) => {
        userStore.userList.splice(index, 1);
    };

    const addUser = () => {
        isEdit.value = false;
        showFlag.value = true;
    };

    const editUser = (index) => {
        isEdit.value = true;
        curIdx.value = index;
        const item = userStore.userList[index];
        studyNum.value = item.id;
        name.value = item.userName;
        year.value = item.age;
        showFlag.value = true;
    };

    const checkList = (code) => {
        for (let index = 0; index < userStore.userList.length; index++) {
            const element = userStore.userList[index];
            if (Number(code) === element.id) {
                return true;
            }
        }
        return false;
    };

    const addNum2name = (name) => {
        // 将姓名后面追加最新编号
        let total = 0;
        userStore.userList.map((item) => {
            if (item.userName.indexOf(name) !== -1) {
                let tempItem = item;
                let tempItemName = tempItem.userName.split('');
                tempItemName.splice(0, name.length);
                let checkItem = isNum(tempItemName.join(''));
                if (tempItemName.length === 0 || checkItem) {
                    total++;
                }
            }
        });
        return `${name}${total === 0 ? '' : total}`;
    };

    const isNum = (val) => {
        let exg = /^\d+$/;
        if (!exg.test(val)) {
            return false;
        }
        return true;
    };

    const submitFn = () => {
        // 输入内容校验
        let studyNumCheck = isNum(studyNum.value);
        if (!studyNumCheck) {
            alert('学号需要为纯数字');
            return;
        }
        let tempName = addNum2name(name.value);
        if (isEdit.value) {
            // 编辑
            userStore.userList.splice(curIdx.value, 1);
            tempName = name.value;
        }
        let isStudyNumExist = checkList(studyNum.value);
        if (isStudyNumExist) {
            alert('学号已存在');
            return;
        }
        userStore.userList.unshift({
            id: studyNum.value,
            userName: tempName,
            age: year.value,
        });
        showFlag.value = false;
        studyNum.value = 0;
        name.value = '';
        year.value = 0;
    };

    const cancelFn = () => {
        showFlag.value = false;
        studyNum.value = 0;
        name.value = '';
        year.value = 0;
    }

    const getYourName = (id) => {
        const student = userStore.userList.find((item) => item.id === id);
        alert(student.userName);
    };
</script>

<style lang="less" scoped></style>

<template>
    <div>
        <a-select
            show-search
            placeholder="选择一个笔记本哦"
            option-filter-prop="children"
            style="width: 245px"
            :filter-option="filterOption"
            @focus="handleFocus"
            @blur="handleBlur"
            @change="handleChange"
        >
            <a-select-option value="jack">
            Jack
            </a-select-option>
            <a-select-option value="lucy">
            Lucy
            </a-select-option>
            <a-select-option value="tom">
            Tom
            </a-select-option>
        </a-select>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                token: this.db.get("USER").token
            }
        },
        props: {
            notes: {}
        },
        mounted() {
            console.log(this.notes)
        },
        methods: {
            handleChange(value) {
                console.log(`selected ${value}`);
            },
            handleBlur() {
                console.log('blur');
            },
            handleFocus() {
                console.log('focus');
            },
            filterOption(input, option) {
                return (
                    option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
                );
            },
        },
    };
</script>
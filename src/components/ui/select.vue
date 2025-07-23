<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { cn } from "../../lib/utils/cn";
import { ChevronDown } from "lucide-vue-next";

const props = defineProps({
  options: {
    type: Array,
    required: true,
  },
  modelValue: {
    type: [Object, String, Number],
    default: null,
  },
  placeholder: {
    type: String,
    default: "Select an option",
  },
  class: {
    type: String,
    default: "",
  },
  disabled: {
    type: Boolean,
    default: false,
  },
  labelKey: {
    type: String,
    default: "label",
  },
  valueKey: {
    type: String,
    default: "value",
  },
});

const emit = defineEmits(["update:modelValue", "option:selected"]);

const isOpen = ref(false);
const selectedOption = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
  selectedOption.value = newValue;
});

const toggleDropdown = () => {
  if (!props.disabled) {
    isOpen.value = !isOpen.value;
  }
};

const closeDropdown = () => {
  isOpen.value = false;
};

const selectOption = (option: any) => {
  if (option !== null) {
    selectedOption.value = option;
    emit("update:modelValue", option);
    emit("option:selected", option);
  }
  closeDropdown();
};

const displayValue = computed(() => {
  if (!selectedOption.value) return props.placeholder;
  
  if (typeof selectedOption.value === 'object') {
    return selectedOption.value[props.labelKey] || props.placeholder;
  }
  
  return selectedOption.value;
});
</script>

<template>
  <div class="relative" v-click-outside="closeDropdown">
    <button
      type="button"
      :class="cn(
        'flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
        props.class
      )"
      :disabled="disabled"
      @click="toggleDropdown"
    >
      <span>{{ displayValue }}</span>
      <ChevronDown class="h-4 w-4 opacity-50" />
    </button>
    <div
      v-if="isOpen"
      class="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover text-popover-foreground shadow-md"
    >
      <div class="p-1">
        <button
          v-for="(option, index) in options"
          :key="index"
          class="relative flex w-full cursor-default select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50"
          @click="selectOption(option)"
        >
          {{ option && typeof option === 'object' ? option[labelKey] : option }}
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
export default {
  directives: {
    'click-outside': {
      mounted(el, binding) {
        el._clickOutside = (event) => {
          if (!(el === event.target || el.contains(event.target))) {
            binding.value(event);
          }
        };
        document.addEventListener('click', el._clickOutside);
      },
      unmounted(el) {
        document.removeEventListener('click', el._clickOutside);
      },
    },
  },
};
</script>

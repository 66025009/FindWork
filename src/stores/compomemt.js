import { defineComponent } from 'vue';

export default defineComponent({
  props: {
    message: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    // การทำงานภายใน setup function
    return () => (
      <div>{props.message}</div>
    );
  },
});

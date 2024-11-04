<script setup>
import { ref, onMounted } from 'vue';
import { useRouter, useRoute } from 'vue-router';
import { useMutation, useQueryClient } from '@tanstack/vue-query';
import ContactForm from '@/components/ContactForm.vue';
import contactService from '@/services/contacts.service';

const props = defineProps({
    contactId: { type: String, required: true }
});

const router = useRouter();
const route = useRoute();
const contact = ref(null);
const message = ref('');
const queryClient = useQueryClient();

// Fetch contact data on component mount
onMounted(async () => {
    try {
        contact.value = await contactService.fetchContact(props.contactId);
    } catch (error) {
        console.log(error);
        router.push({
            name: 'notfound',
            params: { pathMatch: route.path.split('/').slice(1) },
            query: route.query,
            hash: route.hash
        });
    }
});

// Mutation for updating a contact
const updateContactMutation = useMutation({
    mutationFn: async (updatedContact) => {
        await contactService.updateContact(props.contactId, updatedContact);
    },
    onSuccess: () => {
        message.value = 'Liên hệ được cập nhật thành công.';
        // Optionally, refetch or update cache here if necessary
        queryClient.invalidateQueries(['contacts']);
    },
    onError: (error) => {
        console.log(error);
    }
});

// Mutation for deleting a contact
const deleteContactMutation = useMutation({
    mutationFn: async (id) => {
        await contactService.deleteContact(id);
    },
    onSuccess: () => {
        // After successful deletion, navigate back to contact list
        router.push({ name: 'contactbook' });
    },
    onError: (error) => {
        console.log(error);
    }
});

async function onUpdateContact(contact) {
    updateContactMutation.mutate(contact);
}

async function onDeleteContact(id) {
    if (confirm('Bạn muốn xóa Liên hệ này?')) {
        deleteContactMutation.mutate(id);
    }
}
</script>

<template>
    <div v-if="contact" class="page">
        <h4>Hiệu chỉnh liên hệ</h4>
        <ContactForm :contact="contact" @submit:contact="onUpdateContact" @delete:contact="onDeleteContact" />
        <p>{{ message }}</p>
    </div>
</template>

<style scoped>
.page {
    text-align: left;
    max-width: 750px;
}
</style>

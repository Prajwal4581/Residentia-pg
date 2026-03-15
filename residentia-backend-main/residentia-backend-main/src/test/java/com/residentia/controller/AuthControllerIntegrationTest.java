package com.residentia.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashMap;
import java.util.Map;

import static org.hamcrest.Matchers.containsString;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.content;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
public class AuthControllerIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    public void registerClient_missingMobile_returnsBadRequest() throws Exception {
        Map<String, String> payload = new HashMap<>();
        payload.put("email", "missingmobile@example.com");
        payload.put("password", "Pass123!");
        payload.put("name", "Missing Mobile");

        mockMvc.perform(post("/api/auth/register/client")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isBadRequest())
                .andExpect(content().string(containsString("Missing required fields")));
    }

    @Test
    public void registerClient_duplicateMobile_returnsConflict() throws Exception {
        String mobile = "999" + System.currentTimeMillis();

        Map<String, String> p1 = new HashMap<>();
        p1.put("email", "dup1+" + System.currentTimeMillis() + "@example.com");
        p1.put("password", "Pass123!");
        p1.put("mobileNumber", mobile);
        p1.put("name", "Dup One");

        mockMvc.perform(post("/api/auth/register/client")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(p1)))
                .andExpect(status().isCreated());

        Map<String, String> p2 = new HashMap<>();
        p2.put("email", "dup2+" + System.currentTimeMillis() + "@example.com");
        p2.put("password", "Pass123!");
        p2.put("mobileNumber", mobile);
        p2.put("name", "Dup Two");

        mockMvc.perform(post("/api/auth/register/client")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(p2)))
                .andExpect(status().isConflict())
                .andExpect(content().string(containsString("Mobile number already in use")));
    }

    @Test
    public void registerClient_success_returnsCreatedWithToken() throws Exception {
        String mobile = "888" + System.currentTimeMillis();

        Map<String, String> payload = new HashMap<>();
        String email = "success+" + System.currentTimeMillis() + "@example.com";
        payload.put("email", email);
        payload.put("password", "Pass123!");
        payload.put("mobileNumber", mobile);
        payload.put("name", "Success User");

        MvcResult result = mockMvc.perform(post("/api/auth/register/client")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(payload)))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.userId").exists())
                .andExpect(jsonPath("$.message").value("Client registered successfully"))
                .andReturn();

        // Now try logging in with the same credentials
        Map<String, String> login = new HashMap<>();
        login.put("email", email);
        login.put("password", "Pass123!");
        login.put("role", "CLIENT");

        mockMvc.perform(post("/api/auth/login")
                .contentType(MediaType.APPLICATION_JSON)
                .content(objectMapper.writeValueAsString(login)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.token").exists())
                .andExpect(jsonPath("$.userId").exists())
                .andExpect(jsonPath("$.message").value("Client login successful!"));

        // Optional: print response for debugging
        // System.out.println(result.getResponse().getContentAsString());
    }
}

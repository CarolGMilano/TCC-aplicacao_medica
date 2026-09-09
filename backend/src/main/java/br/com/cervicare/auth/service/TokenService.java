package br.com.cervicare.auth.service;

import br.com.cervicare.auth.domain.Usuario;
import com.auth0.jwt.JWT;
import com.auth0.jwt.algorithms.Algorithm;
import com.auth0.jwt.exceptions.JWTCreationException;
import com.auth0.jwt.exceptions.JWTVerificationException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.time.ZoneOffset;

@Service
public class TokenService {

    @Value("${api.security.token.secret}")
    private String secret;

    @Value("${api.security.token.expiration}")
    private Long expiration;

    public String gerarToken(Usuario usuario) {

        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            return JWT.create()
                    .withIssuer("cervicare-api")
                    .withSubject(usuario.getEmail())
                    .withClaim("idUsuario", usuario.getIdUsuario())
                    .withClaim("tipo", usuario.getTipo().name())
                    .withExpiresAt(gerarDataExpiracao())
                    .sign(algorithm);

        } catch (JWTCreationException exception) {
            throw new RuntimeException(
                    "Erro ao gerar token JWT",
                    exception
            );
        }
    }

    public String validarToken(String token) {

        try {
            Algorithm algorithm = Algorithm.HMAC256(secret);

            return JWT.require(algorithm)
                    .withIssuer("cervicare-api")
                    .build()
                    .verify(token)
                    .getSubject();

        } catch (JWTVerificationException exception) {
            return "";
        }
    }

    private Instant gerarDataExpiracao() {

        return LocalDateTime
                .now()
                .plusSeconds(expiration)
                .toInstant(ZoneOffset.of("-03:00"));
    }
}
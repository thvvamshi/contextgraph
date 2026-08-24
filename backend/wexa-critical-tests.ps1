# ============================================================
# WEXA AI ASSIGNMENT - CRITICAL BACKEND SCORING TESTS
# ============================================================

$ErrorActionPreference = "Continue"

$BACKEND = "C:\Users\bodav\Desktop\Projects\contextgraph\backend"
$apiUrl = "http://localhost:5000"

Set-Location $BACKEND

Write-Host ""
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host " WEXA AI - CRITICAL BACKEND SCORING TESTS" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta

$PASS = 0
$FAIL = 0
$WARN = 0

function Pass($message) {
    $script:PASS++
    Write-Host "PASS  $message" -ForegroundColor Green
}

function Fail($message) {
    $script:FAIL++
    Write-Host "FAIL  $message" -ForegroundColor Red
}

function Warn($message) {
    $script:WARN++
    Write-Host "WARN  $message" -ForegroundColor Yellow
}

# ============================================================
# 1. DATABASE CONNECTIVITY
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "1. COGNODB / NEO4J CONNECTIVITY" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$dbTest = npx tsx -e "
import { getDriver } from './src/config/database.ts';

(async () => {
    const d = getDriver();
    const s = d.session();

    try {
        console.log('GRAPH_TEST_START');

        const r = await s.run(
            'MATCH (n) RETURN count(n) AS count'
        );

        console.log(
            'NODE_COUNT=' +
            r.records[0].get('count').toString()
        );

    } catch (e) {
        console.log('DB_FAIL=' + e.message);
    } finally {
        await s.close();
        await d.close();
    }
})();
" 2>&1

$dbText = $dbTest | Out-String

if ($dbText -match 'NODE_COUNT=(\d+)') {

    $nodeCount = [int]$Matches[1]

    Pass "CognoDB connected"
    Pass "Graph contains $nodeCount nodes"

    if ($nodeCount -ge 20) {
        Pass "Graph has sufficient seed data"
    } else {
        Warn "Graph contains only $nodeCount nodes"
    }

} else {

    Fail "CognoDB connectivity failed"

    Write-Host $dbText -ForegroundColor DarkGray
}

# ============================================================
# 2. NODE TYPE INTEGRITY
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "2. GRAPH NODE TYPES" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$nodeTest = npx tsx -e "
import { getDriver } from './src/config/database.ts';

(async () => {

    const d = getDriver();
    const s = d.session();

    const labels = [
        'Customer',
        'Ticket',
        'Product',
        'Feature',
        'Bug',
        'Team',
        'Person',
        'Resolution',
        'Document'
    ];

    try {

        for (const label of labels) {

            const r = await s.run(
                'MATCH (n:' + label + ') RETURN count(n) AS count'
            );

            console.log(
                label.toUpperCase() +
                '_COUNT=' +
                r.records[0].get('count').toString()
            );
        }

    } catch (e) {

        console.log('NODE_TEST_FAIL=' + e.message);

    } finally {

        await s.close();
        await d.close();

    }

})();
" 2>&1

$nodeText = $nodeTest | Out-String

$labels = @(
    "CUSTOMER",
    "TICKET",
    "PRODUCT",
    "FEATURE",
    "BUG",
    "TEAM",
    "PERSON",
    "RESOLUTION",
    "DOCUMENT"
)

foreach ($label in $labels) {

    if ($nodeText -match "${label}_COUNT=(\d+)") {

        $count = [int]$Matches[1]

        if ($count -gt 0) {
            Pass "$label nodes: $count"
        } else {
            Fail "$label nodes: zero"
        }

    } else {

        Fail "$label count unavailable"
    }
}

# ============================================================
# 3. RELATIONSHIP TYPES
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "3. GRAPH RELATIONSHIP TYPES" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$relTest = npx tsx -e "
import { getDriver } from './src/config/database.ts';

(async () => {

    const d = getDriver();
    const s = d.session();

    try {

        const r = await s.run(
            'MATCH ()-[r]->() RETURN DISTINCT type(r) AS type ORDER BY type'
        );

        for (const record of r.records) {
            console.log('REL_TYPE=' + record.get('type'));
        }

    } catch (e) {

        console.log('REL_FAIL=' + e.message);

    } finally {

        await s.close();
        await d.close();

    }

})();
" 2>&1

$relText = $relTest | Out-String

$requiredRelationships = @(
    "RAISED",
    "ABOUT",
    "RELATED_TO",
    "HAS_FEATURE",
    "AFFECTS",
    "OWNED_BY",
    "HAS_MEMBER",
    "RESOLVED_BY",
    "DOCUMENTED_IN"
)

$relationshipFound = 0

foreach ($rel in $requiredRelationships) {

    if ($relText -match "REL_TYPE=$rel") {

        Pass "Relationship exists: $rel"
        $relationshipFound++

    } else {

        Fail "Missing relationship: $rel"
    }
}

# ============================================================
# 4. MULTI-HOP TRAVERSAL
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "4. MULTI-HOP GRAPH TRAVERSAL" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$multiHopTest = npx tsx -e "
import { getDriver } from './src/config/database.ts';

(async () => {

    const d = getDriver();
    const s = d.session();

    try {

        const r = await s.run(
            'MATCH path = ' +
            '(c:Customer {id: \$customerId})' +
            '-[:RAISED]->(t:Ticket)' +
            '-[:RELATED_TO]->(b:Bug)' +
            '-[:OWNED_BY]->(team:Team)' +
            '-[:HAS_MEMBER]->(p:Person)' +
            ' RETURN c.name AS customer, ' +
            't.id AS ticket, ' +
            'b.id AS bug, ' +
            'team.id AS team, ' +
            'p.id AS person, ' +
            'length(path) AS hops',
            {
                customerId: 'customer-acme'
            }
        );

        if (r.records.length > 0) {

            const rec = r.records[0];

            console.log(
                'MULTIHOP_SUCCESS=' +
                rec.get('hops').toString()
            );

            console.log(
                'CUSTOMER=' + rec.get('customer')
            );

            console.log(
                'TICKET=' + rec.get('ticket')
            );

            console.log(
                'BUG=' + rec.get('bug')
            );

            console.log(
                'TEAM=' + rec.get('team')
            );

            console.log(
                'PERSON=' + rec.get('person')
            );

        } else {

            console.log('MULTIHOP_FAIL');

        }

    } catch (e) {

        console.log('MULTIHOP_ERROR=' + e.message);

    } finally {

        await s.close();
        await d.close();

    }

})();
" 2>&1

$multiText = $multiHopTest | Out-String

if ($multiText -match 'MULTIHOP_SUCCESS=(\d+)') {

    $hops = [int]$Matches[1]

    Pass "Multi-hop traversal works: $hops hops"

    if ($hops -ge 4) {
        Pass "4+ hop traversal requirement satisfied"
    } else {
        Warn "Traversal is only $hops hops"
    }

    if ($multiText -match 'TICKET=ticket-1042') {
        Pass "Traversal reached ticket-1042"
    }

    if ($multiText -match 'BUG=bug-221') {
        Pass "Traversal reached bug-221"
    }

    if ($multiText -match 'TEAM=team-payments') {
        Pass "Traversal reached team-payments"
    }

} else {

    Fail "Multi-hop traversal failed"
    Write-Host $multiText -ForegroundColor DarkGray
}

# ============================================================
# 5. RESOLUTION -> DOCUMENT MULTI-HOP
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "5. RESOLUTION / DOCUMENT GRAPH PATH" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$resolutionTest = npx tsx -e "
import { getDriver } from './src/config/database.ts';

(async () => {

    const d = getDriver();
    const s = d.session();

    try {

        const r = await s.run(
            'MATCH path = ' +
            '(c:Customer {id: \$customerId})' +
            '-[:RAISED]->(t:Ticket)' +
            '-[:RELATED_TO]->(b:Bug)' +
            '-[:RESOLVED_BY]->(r:Resolution)' +
            '-[:DOCUMENTED_IN]->(d:Document)' +
            ' RETURN length(path) AS hops, ' +
            'r.id AS resolution, ' +
            'd.id AS document',
            {
                customerId: 'customer-acme'
            }
        );

        if (r.records.length > 0) {

            const rec = r.records[0];

            console.log(
                'RESOLUTION_PATH=' +
                rec.get('hops')
            );

            console.log(
                'RESOLUTION=' +
                rec.get('resolution')
            );

            console.log(
                'DOCUMENT=' +
                rec.get('document')
            );

        } else {

            console.log('RESOLUTION_PATH_FAIL');

        }

    } catch (e) {

        console.log('RESOLUTION_ERROR=' + e.message);

    } finally {

        await s.close();
        await d.close();

    }

})();
" 2>&1

$resText = $resolutionTest | Out-String

if ($resText -match 'RESOLUTION=resolution-87') {
    Pass "Resolution node reached"
} else {
    Fail "Resolution node not reached"
}

if ($resText -match 'DOCUMENT=document-payment-runbook') {
    Pass "Resolution document reached"
} else {
    Fail "Resolution document not reached"
}

# ============================================================
# 6. RELATIONSHIP-HEAVY QUERY
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "6. RELATIONSHIP-HEAVY QUERY" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$heavyTest = npx tsx -e "
import { getDriver } from './src/config/database.ts';

(async () => {

    const d = getDriver();
    const s = d.session();

    try {

        const r = await s.run(
            'MATCH ' +
            '(c:Customer {id: \$customerId})' +
            '-[:RAISED]->(t:Ticket)' +
            '-[:RELATED_TO]->(b:Bug)' +
            '-[:OWNED_BY]->(team:Team)' +
            '-[:HAS_MEMBER]->(p:Person)' +
            ' RETURN count(DISTINCT p) AS people',
            {
                customerId: 'customer-acme'
            }
        );

        console.log(
            'PEOPLE_FOUND=' +
            r.records[0].get('people').toString()
        );

    } catch (e) {

        console.log('HEAVY_QUERY_FAIL=' + e.message);

    } finally {

        await s.close();
        await d.close();

    }

})();
" 2>&1

$heavyText = $heavyTest | Out-String

if ($heavyText -match 'PEOPLE_FOUND=(\d+)') {

    $people = [int]$Matches[1]

    if ($people -gt 0) {
        Pass "Relationship-heavy query returned $people people"
    } else {
        Fail "Relationship-heavy query returned zero"
    }

} else {

    Fail "Relationship-heavy query failed"
}

# ============================================================
# 7. GRAPH-GROUNDED AI
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "7. GRAPH-GROUNDED AI" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$aiTests = @(
    @{
        Name = "Ownership"
        Question = "Who owns Acme current payment API issue?"
        Required = @(
            "ticket-1042",
            "bug-221",
            "team-payments"
        )
    },
    @{
        Name = "Resolution"
        Question = "What is the verified resolution for Acme's payment issue?"
        Required = @(
            "resolution-87",
            "verified"
        )
    },
    @{
        Name = "Experts"
        Question = "Who are the experts working on this issue?"
        Required = @(
            "Rahul Sharma",
            "Ananya Reddy",
            "Priya Nair"
        )
    }
)

$aiPassed = 0

foreach ($test in $aiTests) {

    Write-Host ""
    Write-Host "Testing AI: $($test.Name)" -ForegroundColor Gray

    try {

        $body = @{
            question = $test.Question
        } | ConvertTo-Json

        $response = Invoke-RestMethod `
            -Uri "$apiUrl/api/ai-context/customers/customer-acme/query" `
            -Method POST `
            -Body $body `
            -ContentType "application/json" `
            -ErrorAction Stop

        $json = $response | ConvertTo-Json -Depth 20

        $allFound = $true

        foreach ($required in $test.Required) {

            if ($json -match [regex]::Escape($required)) {

                Pass "$($test.Name): contains $required"

            } else {

                Fail "$($test.Name): missing $required"
                $allFound = $false
            }
        }

        if ($response.data.evidence -and $response.data.evidence.Count -gt 0) {

            Pass "$($test.Name): evidence returned"

        } else {

            Fail "$($test.Name): no evidence returned"
            $allFound = $false
        }

        if ($allFound) {
            $aiPassed++
        }

    } catch {

        Fail "$($test.Name) AI request failed: $($_.Exception.Message)"
    }
}

if ($aiPassed -eq 3) {
    Pass "All graph-grounded AI scenarios passed"
} else {
    Fail "Only $aiPassed/3 AI scenarios passed"
}

# ============================================================
# 8. HALLUCINATION PREVENTION
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "8. HALLUCINATION PREVENTION" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

try {

    $body = @{
        question = "Did a database migration fix Acme's payment issue?"
    } | ConvertTo-Json

    $response = Invoke-RestMethod `
        -Uri "$apiUrl/api/ai-context/customers/customer-acme/query" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -ErrorAction Stop

    $answer = [string]$response.data.answer

    Write-Host "AI answer:" -ForegroundColor Gray
    Write-Host $answer -ForegroundColor DarkGray

    $safeResponse = $false

    if (
        $answer -match "(?i)not enough information" -or
        $answer -match "(?i)no evidence" -or
        $answer -match "(?i)cannot confirm" -or
        $answer -match "(?i)does not provide"
    ) {

        $safeResponse = $true
    }

    if ($safeResponse) {

        Pass "AI refuses unsupported claim"

    } else {

        Fail "AI did not clearly reject unsupported claim"
    }

} catch {

    Fail "Hallucination test failed: $($_.Exception.Message)"
}

# ============================================================
# 9. EVIDENCE TRAIL
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "9. EVIDENCE TRAIL" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

try {

    $body = @{
        question = "Who owns Acme current payment API issue?"
    } | ConvertTo-Json

    $response = Invoke-RestMethod `
        -Uri "$apiUrl/api/ai-context/customers/customer-acme/query" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -ErrorAction Stop

    $evidence = $response.data.evidence

    if ($evidence -and $evidence.Count -gt 0) {

        Pass "Evidence array exists"
        Pass "Evidence contains $($evidence.Count) relationship(s)"

        $evidenceJson = $evidence | ConvertTo-Json -Depth 10

        foreach ($rel in @(
            "RAISED",
            "RELATED_TO",
            "OWNED_BY"
        )) {

            if ($evidenceJson -match $rel) {
                Pass "Evidence contains $rel"
            } else {
                Warn "Evidence missing $rel"
            }
        }

    } else {

        Fail "Evidence trail is empty"
    }

} catch {

    Fail "Evidence test failed: $($_.Exception.Message)
}

# ============================================================
# 10. PARAMETERIZED CYPHER
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "10. PARAMETERIZED CYPHER QUERIES" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$queryFiles = Get-ChildItem `
    ".\src\graph\queries" `
    -Recurse `
    -File `
    -Filter "*.ts"

if ($queryFiles.Count -gt 0) {

    Pass "Found $($queryFiles.Count) graph query files"

    $parameterMatches = $queryFiles |
        Select-String -Pattern '\$[A-Za-z_][A-Za-z0-9_]*'

    if ($parameterMatches.Count -gt 0) {

        Pass "Parameterized Cypher detected: $($parameterMatches.Count) references"

    } else {

        Warn "No Cypher parameter references detected"
    }

} else {

    Fail "No graph query files found"
}

# ============================================================
# 11. HTTP VALIDATION
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "11. API ERROR HANDLING" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

# Missing question

try {

    $body = @{} | ConvertTo-Json

    Invoke-RestMethod `
        -Uri "$apiUrl/api/ai-context/customers/customer-acme/query" `
        -Method POST `
        -Body $body `
        -ContentType "application/json" `
        -ErrorAction Stop | Out-Null

    Fail "Missing question should return 400"

} catch {

    $status = [int]$_.Exception.Response.StatusCode

    if ($status -eq 400) {
        Pass "Missing question returns HTTP 400"
    } else {
        Fail "Missing question returned HTTP $status"
    }
}

# Invalid customer

try {

    Invoke-RestMethod `
        -Uri "$apiUrl/api/ai-context/customers/invalid-customer/query" `
        -Method POST `
        -Body (@{question="test"} | ConvertTo-Json) `
        -ContentType "application/json" `
        -ErrorAction Stop | Out-Null

    Fail "Invalid customer should return 404"

} catch {

    $status = [int]$_.Exception.Response.StatusCode

    if ($status -eq 404) {
        Pass "Invalid AI customer returns HTTP 404"
    } else {
        Warn "Invalid AI customer returned HTTP $status"
    }
}

# Unknown route

try {

    Invoke-RestMethod `
        -Uri "$apiUrl/api/does-not-exist" `
        -Method GET `
        -ErrorAction Stop | Out-Null

    Fail "Unknown route should return 404"

} catch {

    $status = [int]$_.Exception.Response.StatusCode

    if ($status -eq 404) {
        Pass "Unknown route returns HTTP 404"
    } else {
        Fail "Unknown route returned HTTP $status"
    }
}

# ============================================================
# 12. PROVENANCE
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "12. GRAPH PROVENANCE" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$provTest = npx tsx -e "
import { getDriver } from './src/config/database.ts';

(async () => {

    const d = getDriver();
    const s = d.session();

    try {

        const r = await s.run(
            'MATCH (t:Ticket {id: \$ticketId})-[rel]->(b:Bug {id: \$bugId}) ' +
            'RETURN t.id AS source, type(rel) AS relationship, b.id AS target',
            {
                ticketId: 'ticket-1042',
                bugId: 'bug-221'
            }
        );

        if (r.records.length > 0) {

            const rec = r.records[0];

            console.log(
                'PROVENANCE=' +
                rec.get('source') +
                '--' +
                rec.get('relationship') +
                '-->' +
                rec.get('target')
            );

        } else {

            console.log('PROVENANCE_FAIL');

        }

    } catch (e) {

        console.log('PROVENANCE_ERROR=' + e.message);

    } finally {

        await s.close();
        await d.close();

    }

})();
" 2>&1

$provText = $provTest | Out-String

if ($provText -match 'PROVENANCE=ticket-1042--RELATED_TO-->bug-221') {

    Pass "Exact graph provenance verified"

} else {

    Fail "Graph provenance verification failed"
    Write-Host $provText -ForegroundColor DarkGray
}

# ============================================================
# 13. DIRECT GRAPH INTEGRITY
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Cyan
Write-Host "13. DIRECT GRAPH INTEGRITY" -ForegroundColor Cyan
Write-Host "============================================================" -ForegroundColor Cyan

$integrityTest = npx tsx -e "
import { getDriver } from './src/config/database.ts';

(async () => {

    const d = getDriver();
    const s = d.session();

    try {

        const r = await s.run(
            'MATCH (c:Customer {id: \$customerId}) ' +
            'MATCH (t:Ticket {id: \$ticketId}) ' +
            'MATCH (b:Bug {id: \$bugId}) ' +
            'MATCH (team:Team {id: \$teamId}) ' +
            'RETURN c.id, t.id, b.id, team.id',
            {
                customerId: 'customer-acme',
                ticketId: 'ticket-1042',
                bugId: 'bug-221',
                teamId: 'team-payments'
            }
        );

        console.log('INTEGRITY_RECORDS=' + r.records.length);

    } catch (e) {

        console.log('INTEGRITY_FAIL=' + e.message);

    } finally {

        await s.close();
        await d.close();

    }

})();
" 2>&1

$integrityText = $integrityTest | Out-String

if ($integrityText -match 'INTEGRITY_RECORDS=1') {
    Pass "Core Wexa graph entities exist"
} else {
    Fail "Core graph entities missing"
}

# ============================================================
# FINAL RESULT
# ============================================================

Write-Host ""
Write-Host "============================================================" -ForegroundColor Magenta
Write-Host " WEXA AI BACKEND TEST RESULT" -ForegroundColor Magenta
Write-Host "============================================================" -ForegroundColor Magenta

Write-Host ""
Write-Host "PASS : $PASS" -ForegroundColor Green
Write-Host "FAIL : $FAIL" -ForegroundColor Red
Write-Host "WARN : $WARN" -ForegroundColor Yellow

Write-Host ""

if ($FAIL -eq 0) {

    Write-Host "============================================================" -ForegroundColor Green
    Write-Host " ALL CRITICAL BACKEND TESTS PASSED" -ForegroundColor Green
    Write-Host "============================================================" -ForegroundColor Green

} elseif ($FAIL -le 3) {

    Write-Host "============================================================" -ForegroundColor Yellow
    Write-Host " MOST CRITICAL TESTS PASSED - REVIEW FAILURES" -ForegroundColor Yellow
    Write-Host "============================================================" -ForegroundColor Yellow

} else {

    Write-Host "============================================================" -ForegroundColor Red
    Write-Host " CRITICAL BACKEND FAILURES DETECTED" -ForegroundColor Red
    Write-Host "============================================================" -ForegroundColor Red
}

Write-Host ""
Write-Host "Critical Wexa evaluation areas:" -ForegroundColor Cyan
Write-Host " [1] CognoDB / Neo4j usage"
Write-Host " [2] Graph node model"
Write-Host " [3] Relationship model"
Write-Host " [4] Multi-hop traversal"
Write-Host " [5] Resolution/document traversal"
Write-Host " [6] Relationship-heavy queries"
Write-Host " [7] Graph-grounded AI"
Write-Host " [8] Hallucination prevention"
Write-Host " [9] Evidence trail"
Write-Host "[10] Parameterized Cypher"
Write-Host "[11] API validation"
Write-Host "[12] Provenance"
Write-Host "[13] Graph integrity"

Write-Host ""
Write-Host "============================================================" -ForegroundColor Magenta